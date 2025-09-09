#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

// Configuration
const WORDPRESS_XML_PATH = "/Users/marcusberley/Library/CloudStorage/GoogleDrive-marcuspberley@gmail.com/My Drive/WordPress.2025-09-08.xml";
const OUTPUT_DIR = path.join(__dirname, '../data');
const IMAGES_DIR = path.join(__dirname, '../images');

/**
 * WordPress to Sanity Migration Parser
 * Extracts posts, categories, tags, and images from WordPress XML export
 */
class WordPressMigrator {
  constructor() {
    this.posts = [];
    this.categories = [];
    this.tags = [];
    this.authors = [];
    this.attachments = [];
    this.redirects = [];
    
    // Ensure output directories exist
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  /**
   * Parse WordPress XML file
   */
  async parseWordPressXML() {
    console.log('🔍 Parsing WordPress XML export...');
    
    try {
      const xmlContent = fs.readFileSync(WORDPRESS_XML_PATH, 'utf8');
      const parser = new xml2js.Parser({
        tagNameProcessors: [xml2js.processors.stripPrefix],
        attrkey: 'attr',
        charkey: 'text',
        explicitArray: false
      });

      const result = await parser.parseStringPromise(xmlContent);
      const channel = result.rss.channel;

      // Extract data
      await this.extractAuthors(channel);
      await this.extractCategories(channel);
      await this.extractPosts(channel);
      await this.extractAttachments(channel);

      console.log(`✅ Parsed: ${this.posts.length} posts, ${this.categories.length} categories, ${this.attachments.length} attachments`);
      
      return {
        posts: this.posts,
        categories: this.categories,
        authors: this.authors,
        attachments: this.attachments,
        redirects: this.redirects
      };
    } catch (error) {
      console.error('❌ Error parsing WordPress XML:', error);
      throw error;
    }
  }

  /**
   * Extract authors from WordPress export
   */
  async extractAuthors(channel) {
    const wpAuthors = Array.isArray(channel.author) ? channel.author : [channel.author];
    
    for (const wpAuthor of wpAuthors) {
      if (!wpAuthor) continue;
      
      const author = {
        _id: `author-${wpAuthor.author_id}`,
        _type: 'author',
        name: wpAuthor.author_display_name || wpAuthor.author_login,
        email: wpAuthor.author_email,
        slug: this.createSlug(wpAuthor.author_login),
        bio: wpAuthor.author_first_name && wpAuthor.author_last_name 
          ? `${wpAuthor.author_first_name} ${wpAuthor.author_last_name}` 
          : null
      };
      
      this.authors.push(author);
    }
    
    console.log(`📝 Extracted ${this.authors.length} authors`);
  }

  /**
   * Extract categories from WordPress export
   */
  async extractCategories(channel) {
    const wpCategories = Array.isArray(channel.category) ? channel.category : [channel.category];
    
    for (const wpCat of wpCategories) {
      if (!wpCat) continue;
      
      const category = {
        _id: `category-${wpCat.term_id}`,
        _type: 'category',
        title: wpCat.cat_name,
        slug: {
          current: wpCat.category_nicename
        },
        description: wpCat.cat_description || null
      };
      
      this.categories.push(category);
    }
    
    console.log(`🏷️ Extracted ${this.categories.length} categories`);
  }

  /**
   * Extract posts from WordPress export
   */
  async extractPosts(channel) {
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    
    for (const item of items) {
      if (!item || item.post_type !== 'post' || item.status !== 'publish') continue;
      
      try {
        const post = await this.convertPost(item);
        if (post) {
          this.posts.push(post);
          
          // Create redirect mapping
          const wpUrl = this.extractPostUrl(item);
          const newSlug = post.slug.current;
          if (wpUrl && newSlug) {
            this.redirects.push({
              source: wpUrl,
              destination: `/posts/${newSlug}`,
              permanent: true
            });
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error processing post "${item.title}":`, error.message);
      }
    }
    
    console.log(`📄 Extracted ${this.posts.length} posts`);
  }

  /**
   * Extract attachments/images from WordPress export
   */
  async extractAttachments(channel) {
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];
    
    for (const item of items) {
      if (!item || item.post_type !== 'attachment') continue;
      
      const attachment = {
        id: item.post_id,
        title: item.title,
        url: item.attachment_url,
        uploadDate: item.post_date,
        mimeType: this.getMimeType(item.attachment_url),
        filename: path.basename(item.attachment_url)
      };
      
      this.attachments.push(attachment);
    }
    
    console.log(`🖼️ Extracted ${this.attachments.length} attachments`);
  }

  /**
   * Convert WordPress post to Sanity format
   */
  async convertPost(wpPost) {
    const content = wpPost['content:encoded'] || '';
    const excerpt = wpPost['excerpt:encoded'] || '';
    
    // Convert HTML content to Sanity's portable text
    const body = await this.convertHtmlToPortableText(content);
    
    // Extract categories
    const categories = this.extractPostCategories(wpPost);
    
    // Find author
    const author = this.authors.find(a => a.email === wpPost['dc:creator']) || this.authors[0];
    
    // Create slug
    const originalSlug = wpPost.post_name.replace('__trashed', '');
    const slug = this.createSlug(originalSlug || wpPost.title);
    
    return {
      _id: `post-${wpPost.post_id}`,
      _type: 'post',
      title: wpPost.title,
      slug: {
        current: slug
      },
      author: {
        _type: 'reference',
        _ref: author._id
      },
      publishedAt: new Date(wpPost.post_date_gmt + 'Z').toISOString(),
      categories: categories.map(cat => ({
        _type: 'reference',
        _ref: cat._id,
        _key: crypto.randomUUID()
      })),
      excerpt: excerpt || this.generateExcerpt(content),
      body,
      featured: wpPost.is_sticky === '1',
      seo: {
        title: wpPost.title,
        description: excerpt || this.generateExcerpt(content, 160)
      },
      _originalData: {
        wordpressId: wpPost.post_id,
        wordpressSlug: wpPost.post_name,
        wordpressUrl: wpPost.link,
        lastModified: wpPost.post_modified_gmt
      }
    };
  }

  /**
   * Convert HTML to Sanity Portable Text format
   */
  async convertHtmlToPortableText(html) {
    if (!html || html.trim() === '') {
      return [];
    }

    const blocks = [];
    
    // Parse HTML with JSDOM
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    // Handle WordPress blocks and regular HTML
    this.processNode(doc.body, blocks);
    
    return blocks.filter(block => block !== null);
  }

  /**
   * Process DOM nodes recursively and convert to Portable Text
   */
  processNode(node, blocks, currentBlock = null) {
    if (!node) return;

    if (node.nodeType === 3) { // Text node
      const text = node.textContent.trim();
      if (text) {
        if (!currentBlock) {
          currentBlock = {
            _type: 'block',
            _key: crypto.randomUUID(),
            style: 'normal',
            children: [],
            markDefs: []
          };
          blocks.push(currentBlock);
        }
        
        currentBlock.children.push({
          _type: 'span',
          _key: crypto.randomUUID(),
          text: text
        });
      }
      return;
    }

    if (node.nodeType !== 1) return; // Only process element nodes

    const tagName = node.tagName.toLowerCase();
    
    switch (tagName) {
      case 'p':
        const pBlock = {
          _type: 'block',
          _key: crypto.randomUUID(),
          style: 'normal',
          children: [],
          markDefs: []
        };
        blocks.push(pBlock);
        
        for (const child of node.childNodes) {
          this.processNode(child, blocks, pBlock);
        }
        break;
        
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        const headingBlock = {
          _type: 'block',
          _key: crypto.randomUUID(),
          style: tagName,
          children: [],
          markDefs: []
        };
        blocks.push(headingBlock);
        
        for (const child of node.childNodes) {
          this.processNode(child, blocks, headingBlock);
        }
        break;
        
      case 'img':
        // Handle images - we'll need to download these
        const imgBlock = {
          _type: 'image',
          _key: crypto.randomUUID(),
          asset: {
            _type: 'reference',
            _ref: `image-${crypto.randomUUID()}`
          },
          alt: node.getAttribute('alt') || '',
          _originalSrc: node.getAttribute('src')
        };
        blocks.push(imgBlock);
        break;
        
      case 'ul':
        const listBlock = {
          _type: 'block',
          _key: crypto.randomUUID(),
          style: 'normal',
          listItem: 'bullet',
          children: [],
          markDefs: []
        };
        
        for (const li of node.querySelectorAll('li')) {
          const liBlock = {
            _type: 'block',
            _key: crypto.randomUUID(),
            style: 'normal',
            listItem: 'bullet',
            children: [],
            markDefs: []
          };
          
          for (const child of li.childNodes) {
            this.processNode(child, [liBlock], liBlock);
          }
          
          blocks.push(liBlock);
        }
        break;
        
      case 'blockquote':
        const quoteBlock = {
          _type: 'block',
          _key: crypto.randomUUID(),
          style: 'blockquote',
          children: [],
          markDefs: []
        };
        blocks.push(quoteBlock);
        
        for (const child of node.childNodes) {
          this.processNode(child, blocks, quoteBlock);
        }
        break;
        
      default:
        // For other elements, just process their children
        for (const child of node.childNodes) {
          this.processNode(child, blocks, currentBlock);
        }
    }
  }

  /**
   * Extract categories for a post
   */
  extractPostCategories(wpPost) {
    if (!wpPost.category) return [];
    
    const postCategories = Array.isArray(wpPost.category) ? wpPost.category : [wpPost.category];
    
    return postCategories
      .filter(cat => cat.attr && cat.attr.domain === 'category')
      .map(cat => {
        return this.categories.find(c => 
          c.slug.current === cat.attr.nicename
        );
      })
      .filter(Boolean);
  }

  /**
   * Extract WordPress post URL for redirect mapping
   */
  extractPostUrl(wpPost) {
    if (!wpPost.link) return null;
    
    try {
      const url = new URL(wpPost.link);
      return url.pathname;
    } catch {
      return null;
    }
  }

  /**
   * Generate excerpt from HTML content
   */
  generateExcerpt(html, maxLength = 160) {
    if (!html) return '';
    
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || '';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Create URL-safe slug
   */
  createSlug(text) {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
  }

  /**
   * Get MIME type from file extension
   */
  getMimeType(url) {
    const ext = path.extname(url).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Save parsed data to JSON files
   */
  async saveData() {
    console.log('💾 Saving parsed data...');
    
    const data = {
      posts: this.posts,
      categories: this.categories,
      authors: this.authors,
      attachments: this.attachments,
      redirects: this.redirects
    };

    // Save individual files
    fs.writeFileSync(path.join(OUTPUT_DIR, 'posts.json'), JSON.stringify(this.posts, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'categories.json'), JSON.stringify(this.categories, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'authors.json'), JSON.stringify(this.authors, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'attachments.json'), JSON.stringify(this.attachments, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'redirects.json'), JSON.stringify(this.redirects, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'migration-data.json'), JSON.stringify(data, null, 2));

    console.log('✅ Data saved to migration/data/ directory');
    
    return data;
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting WordPress to Sanity migration...');
    
    const migrator = new WordPressMigrator();
    await migrator.parseWordPressXML();
    await migrator.saveData();
    
    console.log('🎉 WordPress parsing complete!');
    console.log('📁 Check migration/data/ for generated JSON files');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { WordPressMigrator };
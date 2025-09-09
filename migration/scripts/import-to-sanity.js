#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

/**
 * Sanity Import Script
 * Imports parsed WordPress data into Sanity CMS
 */
class SanityImporter {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.imagesDir = path.join(__dirname, '../images');
    
    // Initialize Sanity client
    this.client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4qp7h589',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
      apiVersion: '2023-05-03'
    });
    
    this.importResults = {
      authors: { created: 0, updated: 0, errors: 0 },
      categories: { created: 0, updated: 0, errors: 0 },
      images: { created: 0, updated: 0, errors: 0 },
      posts: { created: 0, updated: 0, errors: 0 }
    };
  }

  /**
   * Main import process
   */
  async importAll() {
    console.log('🚀 Starting Sanity import process...');
    
    if (!process.env.SANITY_API_TOKEN) {
      console.error('❌ SANITY_API_TOKEN environment variable is required');
      console.log('💡 Set it in your .env.local file or export it:');
      console.log('   export SANITY_API_TOKEN="your_token_here"');
      return;
    }
    
    try {
      // Test connection
      await this.testConnection();
      
      // Import in order (dependencies first)
      await this.importAuthors();
      await this.importCategories();
      await this.importImages();
      await this.importPosts();
      
      // Generate summary
      this.printSummary();
      
      console.log('🎉 Sanity import complete!');
      
    } catch (error) {
      console.error('💥 Import failed:', error);
      throw error;
    }
  }

  /**
   * Test Sanity connection
   */
  async testConnection() {
    console.log('🔍 Testing Sanity connection...');
    
    try {
      const result = await this.client.fetch('count(*)');
      console.log(`✅ Connected to Sanity. Current document count: ${result}`);
    } catch (error) {
      console.error('❌ Failed to connect to Sanity:', error.message);
      throw error;
    }
  }

  /**
   * Load JSON data file
   */
  loadData(filename) {
    const filepath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filepath)) {
      console.warn(`⚠️ ${filename} not found. Run parse-wordpress.js first.`);
      return [];
    }
    
    try {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (error) {
      console.error(`❌ Error loading ${filename}:`, error.message);
      return [];
    }
  }

  /**
   * Import authors
   */
  async importAuthors() {
    console.log('👥 Importing authors...');
    
    const authors = this.loadData('authors.json');
    
    for (const author of authors) {
      try {
        await this.importDocument(author);
        this.importResults.authors.created++;
        console.log(`✅ Imported author: ${author.name}`);
      } catch (error) {
        console.error(`❌ Failed to import author ${author.name}:`, error.message);
        this.importResults.authors.errors++;
      }
    }
    
    console.log(`📊 Authors: ${this.importResults.authors.created} created, ${this.importResults.authors.errors} errors`);
  }

  /**
   * Import categories
   */
  async importCategories() {
    console.log('🏷️ Importing categories...');
    
    const categories = this.loadData('categories.json');
    
    for (const category of categories) {
      try {
        await this.importDocument(category);
        this.importResults.categories.created++;
        console.log(`✅ Imported category: ${category.title}`);
      } catch (error) {
        console.error(`❌ Failed to import category ${category.title}:`, error.message);
        this.importResults.categories.errors++;
      }
    }
    
    console.log(`📊 Categories: ${this.importResults.categories.created} created, ${this.importResults.categories.errors} errors`);
  }

  /**
   * Import images
   */
  async importImages() {
    console.log('🖼️ Importing images...');
    
    const imageMapping = this.loadData('image-mapping.json');
    const downloadResults = this.loadData('image-download-results.json');
    
    if (!downloadResults || !downloadResults.downloaded) {
      console.warn('⚠️ No downloaded images found. Run download-images.js first.');
      return;
    }
    
    for (const imageInfo of downloadResults.downloaded) {
      if (imageInfo.skipped) continue;
      
      try {
        const imagePath = imageInfo.filepath;
        
        if (!fs.existsSync(imagePath)) {
          console.warn(`⚠️ Image file not found: ${imagePath}`);
          continue;
        }
        
        // Upload image to Sanity
        const asset = await this.uploadImageToSanity(imagePath, imageInfo);
        
        if (asset) {
          this.importResults.images.created++;
          console.log(`✅ Uploaded image: ${imageInfo.filename}`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to upload image ${imageInfo.filename}:`, error.message);
        this.importResults.images.errors++;
      }
    }
    
    console.log(`📊 Images: ${this.importResults.images.created} created, ${this.importResults.images.errors} errors`);
  }

  /**
   * Import posts
   */
  async importPosts() {
    console.log('📝 Importing posts...');
    
    const posts = this.loadData('posts.json');
    const imageMapping = this.loadData('image-mapping.json');
    
    for (const post of posts) {
      try {
        // Update image references in post body
        const updatedPost = await this.updateImageReferences(post, imageMapping);
        
        await this.importDocument(updatedPost);
        this.importResults.posts.created++;
        console.log(`✅ Imported post: ${post.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to import post ${post.title}:`, error.message);
        this.importResults.posts.errors++;
      }
    }
    
    console.log(`📊 Posts: ${this.importResults.posts.created} created, ${this.importResults.posts.errors} errors`);
  }

  /**
   * Upload image to Sanity
   */
  async uploadImageToSanity(imagePath, imageInfo) {
    try {
      const buffer = fs.readFileSync(imagePath);
      
      const asset = await this.client.assets.upload('image', buffer, {
        filename: imageInfo.filename,
        title: imageInfo.metadata.title || imageInfo.filename,
        description: imageInfo.metadata.alt || '',
        creditLine: 'Imported from WordPress'
      });
      
      // Update image mapping with Sanity asset ID
      imageInfo.sanityAssetId = asset._id;
      
      return asset;
      
    } catch (error) {
      console.error(`❌ Failed to upload ${imagePath}:`, error.message);
      return null;
    }
  }

  /**
   * Update image references in post content
   */
  async updateImageReferences(post, imageMapping) {
    if (!post.body || !imageMapping) return post;
    
    const updatedPost = { ...post };
    
    for (const block of updatedPost.body) {
      if (block._type === 'image' && block._originalSrc) {
        const originalUrl = block._originalSrc;
        const mapping = imageMapping[originalUrl];
        
        if (mapping && mapping.sanityId) {
          // Try to find the Sanity asset by filename
          try {
            const assets = await this.client.fetch(
              `*[_type == "sanity.imageAsset" && originalFilename match $filename][0]`,
              { filename: mapping.filename }
            );
            
            if (assets && assets._id) {
              block.asset = {
                _type: 'reference',
                _ref: assets._id
              };
              // Remove original source
              delete block._originalSrc;
            }
          } catch (error) {
            console.warn(`⚠️ Could not find Sanity asset for ${mapping.filename}`);
          }
        }
      }
    }
    
    return updatedPost;
  }

  /**
   * Import a single document to Sanity
   */
  async importDocument(document) {
    try {
      // Check if document already exists
      const existing = await this.client.fetch(
        `*[_id == $id][0]`,
        { id: document._id }
      );
      
      if (existing) {
        // Update existing document
        await this.client
          .patch(document._id)
          .set(document)
          .commit();
      } else {
        // Create new document
        await this.client.create(document);
      }
      
    } catch (error) {
      console.error(`❌ Error importing document ${document._id}:`, error.message);
      throw error;
    }
  }

  /**
   * Create transaction for batch operations
   */
  async createTransaction(documents) {
    const transaction = this.client.transaction();
    
    for (const document of documents) {
      // Check if document exists
      const existing = await this.client.fetch(
        `*[_id == $id][0]`,
        { id: document._id }
      );
      
      if (existing) {
        transaction.patch(document._id, patch => patch.set(document));
      } else {
        transaction.create(document);
      }
    }
    
    return transaction.commit();
  }

  /**
   * Print import summary
   */
  printSummary() {
    console.log('\n📊 Import Summary:');
    console.log('==================');
    
    for (const [type, results] of Object.entries(this.importResults)) {
      const total = results.created + results.updated + results.errors;
      console.log(`${type.toUpperCase()}:`);
      console.log(`  • Created: ${results.created}`);
      console.log(`  • Updated: ${results.updated}`);
      console.log(`  • Errors: ${results.errors}`);
      console.log(`  • Total: ${total}\n`);
    }
    
    const grandTotal = Object.values(this.importResults)
      .reduce((sum, results) => sum + results.created + results.updated + results.errors, 0);
    
    const totalErrors = Object.values(this.importResults)
      .reduce((sum, results) => sum + results.errors, 0);
    
    console.log(`Grand Total: ${grandTotal} documents processed`);
    console.log(`Total Errors: ${totalErrors}`);
    
    if (totalErrors === 0) {
      console.log('🎉 Migration completed successfully with no errors!');
    } else {
      console.log(`⚠️ Migration completed with ${totalErrors} errors. Check logs above.`);
    }
  }

  /**
   * Clean up existing migration data (use with caution)
   */
  async cleanupMigrationData() {
    console.log('🧹 Cleaning up existing migration data...');
    console.log('⚠️ This will delete all posts, categories, and authors imported from WordPress!');
    
    const confirmation = await new Promise(resolve => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Are you sure? Type "yes" to confirm: ', answer => {
        readline.close();
        resolve(answer.toLowerCase() === 'yes');
      });
    });
    
    if (!confirmation) {
      console.log('❌ Cleanup cancelled.');
      return;
    }
    
    try {
      // Delete posts
      const posts = await this.client.fetch(`*[_type == "post" && _id match "post-*"]._id`);
      if (posts.length > 0) {
        await this.client.delete({ query: `*[_type == "post" && _id match "post-*"]` });
        console.log(`🗑️ Deleted ${posts.length} posts`);
      }
      
      // Delete categories
      const categories = await this.client.fetch(`*[_type == "category" && _id match "category-*"]._id`);
      if (categories.length > 0) {
        await this.client.delete({ query: `*[_type == "category" && _id match "category-*"]` });
        console.log(`🗑️ Deleted ${categories.length} categories`);
      }
      
      // Delete authors
      const authors = await this.client.fetch(`*[_type == "author" && _id match "author-*"]._id`);
      if (authors.length > 0) {
        await this.client.delete({ query: `*[_type == "author" && _id match "author-*"]` });
        console.log(`🗑️ Deleted ${authors.length} authors`);
      }
      
      console.log('✅ Cleanup completed!');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const isCleanup = args.includes('--cleanup');
  
  try {
    console.log('🚀 Starting Sanity import...');
    
    const importer = new SanityImporter();
    
    if (isCleanup) {
      await importer.cleanupMigrationData();
    } else {
      await importer.importAll();
    }
    
    console.log('🎉 Sanity import process complete!');
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { SanityImporter };
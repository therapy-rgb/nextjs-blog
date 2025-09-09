#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Redirect Generator
 * Generates Next.js redirect configuration from WordPress URLs
 */
class RedirectGenerator {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.projectRoot = path.join(__dirname, '../..');
    this.redirects = [];
    this.categoryRedirects = [];
    this.imageRedirects = [];
  }

  /**
   * Generate all redirect configurations
   */
  async generateAllRedirects() {
    console.log('🔄 Generating redirect configurations...');
    
    // Load migration data
    const posts = this.loadData('posts.json');
    const categories = this.loadData('categories.json');
    const imageMapping = this.loadData('image-mapping.json');
    const redirectData = this.loadData('redirects.json');
    
    // Generate post redirects
    this.generatePostRedirects(posts, redirectData);
    
    // Generate category redirects
    this.generateCategoryRedirects(categories);
    
    // Generate image redirects
    this.generateImageRedirects(imageMapping);
    
    // Generate Next.js configuration
    await this.updateNextConfig();
    
    // Generate Apache .htaccess (if needed)
    this.generateHtaccess();
    
    // Generate Vercel redirects
    this.generateVercelRedirects();
    
    // Save redirect data
    this.saveRedirectData();
    
    this.printSummary();
    
    console.log('✅ Redirect generation complete!');
  }

  /**
   * Load JSON data file
   */
  loadData(filename) {
    const filepath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filepath)) {
      console.warn(`⚠️ ${filename} not found. Some redirects may be missing.`);
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
   * Generate post redirects
   */
  generatePostRedirects(posts, redirectData) {
    console.log('📄 Generating post redirects...');
    
    // Use existing redirect data if available
    if (redirectData && Array.isArray(redirectData)) {
      this.redirects.push(...redirectData);
      console.log(`✅ Added ${redirectData.length} post redirects from parsed data`);
      return;
    }
    
    // Generate redirects from post data
    for (const post of posts) {
      if (!post._originalData || !post._originalData.wordpressUrl) continue;
      
      try {
        const wpUrl = new URL(post._originalData.wordpressUrl);
        const wpPath = wpUrl.pathname;
        const newPath = `/posts/${post.slug.current}`;
        
        // Skip if paths are the same
        if (wpPath === newPath) continue;
        
        this.redirects.push({
          source: wpPath,
          destination: newPath,
          permanent: true,
          description: `WordPress post: ${post.title}`
        });
        
        // Also redirect common WordPress URL patterns
        const postId = post._originalData.wordpressId;
        if (postId) {
          this.redirects.push({
            source: `/?p=${postId}`,
            destination: newPath,
            permanent: true,
            description: `WordPress post ID: ${post.title}`
          });
        }
        
      } catch (error) {
        console.warn(`⚠️ Could not generate redirect for post "${post.title}":`, error.message);
      }
    }
    
    console.log(`✅ Generated ${this.redirects.length} post redirects`);
  }

  /**
   * Generate category redirects
   */
  generateCategoryRedirects(categories) {
    console.log('🏷️ Generating category redirects...');
    
    for (const category of categories) {
      const wpCategoryUrl = `/category/${category.slug.current}`;
      const newCategoryUrl = `/categories/${category.slug.current}`;
      
      this.categoryRedirects.push({
        source: wpCategoryUrl,
        destination: newCategoryUrl,
        permanent: true,
        description: `Category: ${category.title}`
      });
      
      // Also handle /category/{slug}/page/{number} patterns
      this.categoryRedirects.push({
        source: `/category/${category.slug.current}/page/:page`,
        destination: `${newCategoryUrl}?page=:page`,
        permanent: true,
        description: `Category pagination: ${category.title}`
      });
    }
    
    // Generic category redirects
    this.categoryRedirects.push(
      {
        source: '/category/:slug*',
        destination: '/categories/:slug*',
        permanent: true,
        description: 'Generic category redirect'
      }
    );
    
    console.log(`✅ Generated ${this.categoryRedirects.length} category redirects`);
  }

  /**
   * Generate image redirects
   */
  generateImageRedirects(imageMapping) {
    console.log('🖼️ Generating image redirects...');
    
    if (!imageMapping) {
      console.warn('⚠️ No image mapping found. Skipping image redirects.');
      return;
    }
    
    for (const [originalUrl, mapping] of Object.entries(imageMapping)) {
      try {
        const originalUrlObj = new URL(originalUrl);
        const wpImagePath = originalUrlObj.pathname;
        
        // Redirect to new image path (assuming images will be served from /images/)
        const newImagePath = `/images/${mapping.filename}`;
        
        this.imageRedirects.push({
          source: wpImagePath,
          destination: newImagePath,
          permanent: true,
          description: `Image: ${mapping.filename}`
        });
        
      } catch (error) {
        console.warn(`⚠️ Could not generate redirect for image ${originalUrl}:`, error.message);
      }
    }
    
    console.log(`✅ Generated ${this.imageRedirects.length} image redirects`);
  }

  /**
   * Update Next.js configuration with redirects
   */
  async updateNextConfig() {
    console.log('⚙️ Updating Next.js configuration...');
    
    const nextConfigPath = path.join(this.projectRoot, 'next.config.ts');
    
    if (!fs.existsSync(nextConfigPath)) {
      console.warn('⚠️ next.config.ts not found. Creating new one...');
      await this.createNewNextConfig();
      return;
    }
    
    try {
      let configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Combine all redirects
      const allRedirects = [
        ...this.redirects,
        ...this.categoryRedirects,
        ...this.imageRedirects
      ];
      
      // Generate redirects array for Next.js
      const redirectsCode = this.generateNextRedirectsCode(allRedirects);
      
      // Check if redirects function already exists
      if (configContent.includes('async redirects()')) {
        // Replace existing redirects function
        configContent = configContent.replace(
          /async redirects\(\)\s*\{[\s\S]*?\},?\s*/,
          redirectsCode
        );
      } else {
        // Add redirects function before the closing brace
        configContent = configContent.replace(
          /(\s*}\s*;?\s*)$/,
          `,\n${redirectsCode}$1`
        );
      }
      
      fs.writeFileSync(nextConfigPath, configContent);
      console.log(`✅ Updated next.config.ts with ${allRedirects.length} redirects`);
      
    } catch (error) {
      console.error('❌ Failed to update next.config.ts:', error.message);
      console.log('💡 You may need to manually add redirects to your Next.js config');
    }
  }

  /**
   * Create new Next.js config with redirects
   */
  async createNewNextConfig() {
    const allRedirects = [
      ...this.redirects,
      ...this.categoryRedirects,
      ...this.imageRedirects
    ];
    
    const redirectsCode = this.generateNextRedirectsCode(allRedirects);
    
    const configContent = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['src'],
  },
${redirectsCode}
};

export default nextConfig;`;

    const nextConfigPath = path.join(this.projectRoot, 'next.config.ts');
    fs.writeFileSync(nextConfigPath, configContent);
    
    console.log(`✅ Created next.config.ts with ${allRedirects.length} redirects`);
  }

  /**
   * Generate Next.js redirects code
   */
  generateNextRedirectsCode(redirects) {
    if (redirects.length === 0) return '';
    
    const redirectsArray = redirects.map(redirect => {
      return `    {
      source: '${redirect.source}',
      destination: '${redirect.destination}',
      permanent: ${redirect.permanent}
    }`;
    }).join(',\n');
    
    return `  async redirects() {
    return [
${redirectsArray}
    ];
  }`;
  }

  /**
   * Generate Apache .htaccess file
   */
  generateHtaccess() {
    console.log('📄 Generating .htaccess file...');
    
    const allRedirects = [
      ...this.redirects,
      ...this.categoryRedirects,
      ...this.imageRedirects
    ];
    
    let htaccessContent = `# WordPress to Next.js Migration Redirects
# Generated automatically by migration script

# Enable rewrite engine
RewriteEngine On

# WordPress post redirects
`;
    
    for (const redirect of allRedirects) {
      const status = redirect.permanent ? '301' : '302';
      const source = redirect.source.replace(/:\w+/g, '(.+)');
      const destination = redirect.destination.replace(/:(\w+)/g, '$$$1');
      
      htaccessContent += `# ${redirect.description || 'Redirect'}\n`;
      htaccessContent += `RewriteRule ^${source.replace(/^\//, '')}$ ${destination} [R=${status},L]\n\n`;
    }
    
    const htaccessPath = path.join(this.dataDir, '.htaccess');
    fs.writeFileSync(htaccessPath, htaccessContent);
    
    console.log(`✅ Generated .htaccess with ${allRedirects.length} redirects`);
  }

  /**
   * Generate Vercel redirects
   */
  generateVercelRedirects() {
    console.log('▲ Generating Vercel redirects...');
    
    const allRedirects = [
      ...this.redirects,
      ...this.categoryRedirects,
      ...this.imageRedirects
    ];
    
    const vercelRedirects = allRedirects.map(redirect => ({
      source: redirect.source,
      destination: redirect.destination,
      statusCode: redirect.permanent ? 301 : 302
    }));
    
    const vercelConfig = {
      redirects: vercelRedirects
    };
    
    const vercelConfigPath = path.join(this.dataDir, 'vercel-redirects.json');
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    
    console.log(`✅ Generated Vercel redirects config with ${allRedirects.length} redirects`);
    console.log('💡 Add these redirects to your vercel.json file');
  }

  /**
   * Save redirect data
   */
  saveRedirectData() {
    const redirectData = {
      posts: this.redirects,
      categories: this.categoryRedirects,
      images: this.imageRedirects,
      combined: [
        ...this.redirects,
        ...this.categoryRedirects,
        ...this.imageRedirects
      ],
      summary: {
        totalRedirects: this.redirects.length + this.categoryRedirects.length + this.imageRedirects.length,
        postRedirects: this.redirects.length,
        categoryRedirects: this.categoryRedirects.length,
        imageRedirects: this.imageRedirects.length
      }
    };
    
    const redirectPath = path.join(this.dataDir, 'all-redirects.json');
    fs.writeFileSync(redirectPath, JSON.stringify(redirectData, null, 2));
    
    console.log('💾 Saved redirect data to all-redirects.json');
  }

  /**
   * Print summary of generated redirects
   */
  printSummary() {
    console.log('\n🔄 Redirect Generation Summary:');
    console.log('==============================');
    console.log(`Posts: ${this.redirects.length} redirects`);
    console.log(`Categories: ${this.categoryRedirects.length} redirects`);
    console.log(`Images: ${this.imageRedirects.length} redirects`);
    console.log(`Total: ${this.redirects.length + this.categoryRedirects.length + this.imageRedirects.length} redirects`);
    console.log('');
    console.log('📁 Generated files:');
    console.log('  • next.config.ts (updated with redirects)');
    console.log('  • migration/data/.htaccess');
    console.log('  • migration/data/vercel-redirects.json');
    console.log('  • migration/data/all-redirects.json');
  }

  /**
   * Test redirects (optional validation)
   */
  async testRedirects() {
    console.log('🧪 Testing redirect configurations...');
    
    const allRedirects = [
      ...this.redirects,
      ...this.categoryRedirects,
      ...this.imageRedirects
    ];
    
    let validRedirects = 0;
    let invalidRedirects = 0;
    
    for (const redirect of allRedirects.slice(0, 10)) { // Test first 10
      try {
        new URL(redirect.source, 'https://suburbandadmode.com');
        new URL(redirect.destination, 'https://suburbandadmode.com');
        validRedirects++;
      } catch (error) {
        console.warn(`⚠️ Invalid redirect: ${redirect.source} -> ${redirect.destination}`);
        invalidRedirects++;
      }
    }
    
    console.log(`✅ Tested ${validRedirects} valid redirects`);
    if (invalidRedirects > 0) {
      console.log(`⚠️ Found ${invalidRedirects} invalid redirects`);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const shouldTest = args.includes('--test');
  
  try {
    console.log('🚀 Starting redirect generation...');
    
    const generator = new RedirectGenerator();
    await generator.generateAllRedirects();
    
    if (shouldTest) {
      await generator.testRedirects();
    }
    
    console.log('🎉 Redirect generation complete!');
    console.log('💡 Don\'t forget to test your redirects after deployment');
    
  } catch (error) {
    console.error('💥 Redirect generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { RedirectGenerator };
#!/usr/bin/env node

const { WordPressMigrator } = require('./parse-wordpress.js');
const { ImageDownloader } = require('./download-images.js');
const { SanityImporter } = require('./import-to-sanity.js');
const { RedirectGenerator } = require('./generate-redirects.js');

/**
 * Main Migration Runner
 * Orchestrates the complete WordPress to Sanity migration process
 */
class MigrationRunner {
  constructor(options = {}) {
    this.options = {
      skipImages: options.skipImages || false,
      skipImport: options.skipImport || false,
      skipRedirects: options.skipRedirects || false,
      dryRun: options.dryRun || false,
      ...options
    };
    
    this.results = {
      parsing: null,
      images: null,
      import: null,
      redirects: null
    };
  }

  /**
   * Run complete migration process
   */
  async runMigration() {
    console.log('🚀 Starting complete WordPress to Sanity migration...');
    console.log('================================================\n');
    
    try {
      // Step 1: Parse WordPress XML
      console.log('📖 Step 1: Parsing WordPress export...');
      await this.parseWordPress();
      
      // Step 2: Download images
      if (!this.options.skipImages) {
        console.log('\n🖼️ Step 2: Downloading images...');
        await this.downloadImages();
      } else {
        console.log('\n⏭️ Step 2: Skipping image download');
      }
      
      // Step 3: Import to Sanity
      if (!this.options.skipImport && !this.options.dryRun) {
        console.log('\n📝 Step 3: Importing to Sanity...');
        await this.importToSanity();
      } else {
        console.log('\n⏭️ Step 3: Skipping Sanity import');
      }
      
      // Step 4: Generate redirects
      if (!this.options.skipRedirects) {
        console.log('\n🔄 Step 4: Generating redirects...');
        await this.generateRedirects();
      } else {
        console.log('\n⏭️ Step 4: Skipping redirect generation');
      }
      
      // Final summary
      this.printFinalSummary();
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('=======================================');
      
    } catch (error) {
      console.error('\n💥 Migration failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }

  /**
   * Parse WordPress XML export
   */
  async parseWordPress() {
    try {
      const migrator = new WordPressMigrator();
      this.results.parsing = await migrator.parseWordPressXML();
      await migrator.saveData();
      
      console.log('✅ WordPress parsing completed');
      
    } catch (error) {
      console.error('❌ WordPress parsing failed:', error.message);
      throw error;
    }
  }

  /**
   * Download images from WordPress
   */
  async downloadImages() {
    try {
      const downloader = new ImageDownloader();
      await downloader.downloadAllImages();
      
      this.results.images = {
        downloaded: downloader.downloadedImages.length,
        failed: downloader.failedDownloads.length
      };
      
      console.log('✅ Image download completed');
      
    } catch (error) {
      console.error('❌ Image download failed:', error.message);
      throw error;
    }
  }

  /**
   * Import data to Sanity
   */
  async importToSanity() {
    try {
      const importer = new SanityImporter();
      await importer.importAll();
      
      this.results.import = importer.importResults;
      
      console.log('✅ Sanity import completed');
      
    } catch (error) {
      console.error('❌ Sanity import failed:', error.message);
      throw error;
    }
  }

  /**
   * Generate URL redirects
   */
  async generateRedirects() {
    try {
      const generator = new RedirectGenerator();
      await generator.generateAllRedirects();
      
      this.results.redirects = {
        posts: generator.redirects.length,
        categories: generator.categoryRedirects.length,
        images: generator.imageRedirects.length,
        total: generator.redirects.length + generator.categoryRedirects.length + generator.imageRedirects.length
      };
      
      console.log('✅ Redirect generation completed');
      
    } catch (error) {
      console.error('❌ Redirect generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Print final migration summary
   */
  printFinalSummary() {
    console.log('\n📊 FINAL MIGRATION SUMMARY');
    console.log('==========================');
    
    if (this.results.parsing) {
      console.log(`\n📖 WordPress Parsing:`);
      console.log(`  • Posts: ${this.results.parsing.posts.length}`);
      console.log(`  • Categories: ${this.results.parsing.categories.length}`);
      console.log(`  • Authors: ${this.results.parsing.authors.length}`);
      console.log(`  • Attachments: ${this.results.parsing.attachments.length}`);
    }
    
    if (this.results.images) {
      console.log(`\n🖼️ Image Processing:`);
      console.log(`  • Downloaded: ${this.results.images.downloaded}`);
      console.log(`  • Failed: ${this.results.images.failed}`);
    }
    
    if (this.results.import) {
      console.log(`\n📝 Sanity Import:`);
      for (const [type, stats] of Object.entries(this.results.import)) {
        const total = stats.created + stats.updated + stats.errors;
        console.log(`  • ${type}: ${stats.created} created, ${stats.errors} errors (${total} total)`);
      }
    }
    
    if (this.results.redirects) {
      console.log(`\n🔄 Redirects Generated:`);
      console.log(`  • Posts: ${this.results.redirects.posts}`);
      console.log(`  • Categories: ${this.results.redirects.categories}`);
      console.log(`  • Images: ${this.results.redirects.images}`);
      console.log(`  • Total: ${this.results.redirects.total}`);
    }
    
    console.log(`\n📁 Output Files:`);
    console.log(`  • migration/data/ - All parsed data (JSON)`);
    console.log(`  • migration/images/ - Downloaded images`);
    console.log(`  • next.config.ts - Updated with redirects`);
    console.log(`  • migration/data/vercel-redirects.json - Vercel config`);
    console.log(`  • migration/data/.htaccess - Apache redirects`);
  }

  /**
   * Validate migration prerequisites
   */
  async validatePrerequisites() {
    console.log('🔍 Validating migration prerequisites...');
    
    const fs = require('fs');
    const path = require('path');
    
    // Check WordPress XML file
    const xmlPath = "/Users/marcusberley/Library/CloudStorage/GoogleDrive-marcuspberley@gmail.com/My Drive/WordPress.2025-09-08.xml";
    if (!fs.existsSync(xmlPath)) {
      throw new Error(`WordPress XML file not found: ${xmlPath}`);
    }
    
    // Check Sanity environment variables (if not skipping import)
    if (!this.options.skipImport && !this.options.dryRun) {
      if (!process.env.SANITY_API_TOKEN) {
        console.warn('⚠️ SANITY_API_TOKEN not set. Sanity import will be skipped.');
        this.options.skipImport = true;
      }
    }
    
    console.log('✅ Prerequisites validated');
  }

  /**
   * Show help information
   */
  static showHelp() {
    console.log(`
WordPress to Sanity Migration Tool
==================================

Usage: node migrate.js [options]

Options:
  --skip-images     Skip image download
  --skip-import     Skip Sanity import
  --skip-redirects  Skip redirect generation
  --dry-run         Parse only, don't import to Sanity
  --help            Show this help message

Examples:
  node migrate.js                    # Full migration
  node migrate.js --dry-run          # Parse and prepare data only
  node migrate.js --skip-images      # Skip image download
  node migrate.js --skip-import      # Skip Sanity import

Environment Variables:
  SANITY_API_TOKEN                   # Required for Sanity import
  NEXT_PUBLIC_SANITY_PROJECT_ID      # Sanity project ID
  NEXT_PUBLIC_SANITY_DATASET         # Sanity dataset (default: production)
`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    MigrationRunner.showHelp();
    return;
  }
  
  const options = {
    skipImages: args.includes('--skip-images'),
    skipImport: args.includes('--skip-import'),
    skipRedirects: args.includes('--skip-redirects'),
    dryRun: args.includes('--dry-run')
  };
  
  const runner = new MigrationRunner(options);
  
  try {
    await runner.validatePrerequisites();
    await runner.runMigration();
  } catch (error) {
    console.error('💥 Migration runner failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { MigrationRunner };
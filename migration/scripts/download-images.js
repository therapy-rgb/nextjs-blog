#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const sharp = require('sharp');
const crypto = require('crypto');

/**
 * Image Download and Processing Script
 * Downloads images from WordPress site and prepares them for Sanity
 */
class ImageDownloader {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.imagesDir = path.join(__dirname, '../images');
    this.downloadedImages = [];
    this.failedDownloads = [];
    
    // Ensure directories exist
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
    }
  }

  /**
   * Download all images from attachments and post content
   */
  async downloadAllImages() {
    console.log('🖼️ Starting image download process...');
    
    // Load parsed data
    const attachments = this.loadData('attachments.json');
    const posts = this.loadData('posts.json');
    
    if (!attachments || !posts) {
      console.error('❌ Could not load migration data. Run parse-wordpress.js first.');
      return;
    }

    // Download attachment images
    console.log(`📥 Downloading ${attachments.length} attachment images...`);
    for (const attachment of attachments) {
      if (attachment.url && this.isImageFile(attachment.url)) {
        await this.downloadImage(attachment.url, attachment);
      }
    }

    // Find and download images in post content
    console.log('🔍 Scanning posts for embedded images...');
    const embeddedImages = this.findEmbeddedImages(posts);
    
    console.log(`📥 Downloading ${embeddedImages.length} embedded images...`);
    for (const imageInfo of embeddedImages) {
      await this.downloadImage(imageInfo.url, imageInfo);
    }

    // Generate image mapping for Sanity import
    await this.generateImageMapping();
    
    // Save results
    this.saveDownloadResults();
    
    console.log(`✅ Image download complete!`);
    console.log(`📊 Downloaded: ${this.downloadedImages.length} images`);
    console.log(`❌ Failed: ${this.failedDownloads.length} images`);
  }

  /**
   * Load JSON data file
   */
  loadData(filename) {
    const filepath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filepath)) {
      return null;
    }
    
    try {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (error) {
      console.error(`❌ Error loading ${filename}:`, error.message);
      return null;
    }
  }

  /**
   * Check if URL points to an image file
   */
  isImageFile(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const urlPath = new URL(url).pathname.toLowerCase();
    return imageExtensions.some(ext => urlPath.includes(ext));
  }

  /**
   * Find embedded images in post content
   */
  findEmbeddedImages(posts) {
    const embeddedImages = [];
    const seenUrls = new Set();
    
    for (const post of posts) {
      if (!post.body) continue;
      
      for (const block of post.body) {
        if (block._type === 'image' && block._originalSrc) {
          const imageUrl = block._originalSrc;
          
          if (!seenUrls.has(imageUrl) && this.isImageFile(imageUrl)) {
            seenUrls.add(imageUrl);
            embeddedImages.push({
              url: imageUrl,
              alt: block.alt || '',
              postId: post._id,
              blockKey: block._key
            });
          }
        }
      }
    }
    
    return embeddedImages;
  }

  /**
   * Download a single image
   */
  async downloadImage(imageUrl, metadata = {}) {
    try {
      const url = new URL(imageUrl);
      const filename = this.generateFilename(imageUrl);
      const filepath = path.join(this.imagesDir, filename);
      
      // Skip if already downloaded
      if (fs.existsSync(filepath)) {
        console.log(`⏭️ Skipping existing file: ${filename}`);
        this.downloadedImages.push({
          originalUrl: imageUrl,
          filename,
          filepath,
          metadata,
          skipped: true
        });
        return;
      }

      console.log(`📥 Downloading: ${filename}...`);
      
      const imageBuffer = await this.fetchImage(imageUrl);
      
      if (!imageBuffer) {
        throw new Error('No image data received');
      }

      // Process image with Sharp
      const processedImage = await this.processImage(imageBuffer, filename);
      
      // Save original image
      fs.writeFileSync(filepath, processedImage.buffer);
      
      // Generate optimized versions
      const variants = await this.generateImageVariants(processedImage.buffer, filename);
      
      const downloadInfo = {
        originalUrl: imageUrl,
        filename,
        filepath,
        metadata,
        dimensions: processedImage.info,
        variants,
        sanityImageId: this.generateSanityImageId(filename)
      };
      
      this.downloadedImages.push(downloadInfo);
      console.log(`✅ Downloaded: ${filename} (${processedImage.info.width}x${processedImage.info.height})`);
      
    } catch (error) {
      console.error(`❌ Failed to download ${imageUrl}:`, error.message);
      this.failedDownloads.push({
        url: imageUrl,
        error: error.message,
        metadata
      });
    }
  }

  /**
   * Fetch image from URL
   */
  async fetchImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const url = new URL(imageUrl);
      const client = url.protocol === 'https:' ? https : http;
      
      const request = client.get(imageUrl, {
        headers: {
          'User-Agent': 'WordPress-to-Sanity-Migration/1.0'
        }
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      });

      request.on('error', reject);
      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  /**
   * Process image with Sharp
   */
  async processImage(buffer, filename) {
    try {
      const image = sharp(buffer);
      const info = await image.metadata();
      
      // Convert to web-friendly formats and optimize
      let processedBuffer = buffer;
      
      // Convert HEIC/HEIF to JPEG
      if (info.format === 'heif' || info.format === 'heic') {
        processedBuffer = await image.jpeg({ quality: 90 }).toBuffer();
        info.format = 'jpeg';
      }
      
      // Optimize without changing format for web formats
      if (['jpeg', 'jpg', 'png', 'webp'].includes(info.format)) {
        processedBuffer = await image
          .jpeg({ quality: 90 })
          .toBuffer();
      }
      
      return {
        buffer: processedBuffer,
        info: {
          width: info.width,
          height: info.height,
          format: info.format,
          size: processedBuffer.length
        }
      };
    } catch (error) {
      console.warn(`⚠️ Sharp processing failed for ${filename}, using original:`, error.message);
      return {
        buffer,
        info: {
          width: null,
          height: null,
          format: 'unknown',
          size: buffer.length
        }
      };
    }
  }

  /**
   * Generate image variants (thumbnails, etc.)
   */
  async generateImageVariants(buffer, originalFilename) {
    const variants = [];
    const baseName = path.parse(originalFilename).name;
    const ext = path.parse(originalFilename).ext;
    
    const sizes = [
      { name: 'thumbnail', width: 300 },
      { name: 'medium', width: 600 },
      { name: 'large', width: 1200 }
    ];
    
    for (const size of sizes) {
      try {
        const variantFilename = `${baseName}-${size.name}${ext}`;
        const variantPath = path.join(this.imagesDir, variantFilename);
        
        const resizedBuffer = await sharp(buffer)
          .resize({ width: size.width, withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        fs.writeFileSync(variantPath, resizedBuffer);
        
        const metadata = await sharp(resizedBuffer).metadata();
        
        variants.push({
          name: size.name,
          filename: variantFilename,
          width: metadata.width,
          height: metadata.height,
          size: resizedBuffer.length
        });
        
      } catch (error) {
        console.warn(`⚠️ Failed to generate ${size.name} variant for ${originalFilename}:`, error.message);
      }
    }
    
    return variants;
  }

  /**
   * Generate consistent filename from URL
   */
  generateFilename(imageUrl) {
    const url = new URL(imageUrl);
    let filename = path.basename(url.pathname);
    
    // Handle URLs without clear filenames
    if (!filename || !path.extname(filename)) {
      const hash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
      filename = `image-${hash}.jpg`;
    }
    
    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return filename;
  }

  /**
   * Generate Sanity image ID
   */
  generateSanityImageId(filename) {
    const hash = crypto.createHash('md5').update(filename).digest('hex');
    return `image-${hash}`;
  }

  /**
   * Generate image mapping file for Sanity import
   */
  async generateImageMapping() {
    const imageMapping = {};
    
    for (const image of this.downloadedImages) {
      imageMapping[image.originalUrl] = {
        sanityId: image.sanityImageId,
        filename: image.filename,
        filepath: image.filepath,
        dimensions: image.dimensions,
        variants: image.variants
      };
    }
    
    const mappingPath = path.join(this.dataDir, 'image-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));
    
    console.log(`📋 Generated image mapping: ${Object.keys(imageMapping).length} images`);
  }

  /**
   * Save download results
   */
  saveDownloadResults() {
    const results = {
      downloaded: this.downloadedImages,
      failed: this.failedDownloads,
      summary: {
        totalAttempts: this.downloadedImages.length + this.failedDownloads.length,
        successful: this.downloadedImages.length,
        failed: this.failedDownloads.length,
        skipped: this.downloadedImages.filter(img => img.skipped).length
      }
    };
    
    const resultsPath = path.join(this.dataDir, 'image-download-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting image download process...');
    
    const downloader = new ImageDownloader();
    await downloader.downloadAllImages();
    
    console.log('🎉 Image download complete!');
    console.log('📁 Check migration/images/ for downloaded files');
    
  } catch (error) {
    console.error('💥 Image download failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { ImageDownloader };
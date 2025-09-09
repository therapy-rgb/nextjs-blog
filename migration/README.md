# WordPress to Sanity Migration Tools

Complete migration toolkit for transferring content from WordPress to Sanity CMS while preserving all metadata, images, and SEO structure.

## 🚀 Quick Start

```bash
# Navigate to migration directory
cd migration

# Install dependencies
npm install

# Run complete migration
npm run migrate

# Or run individual steps
npm run parse           # Parse WordPress XML
npm run download-images # Download all images
npm run import-sanity   # Import to Sanity
npm run generate-redirects # Generate URL redirects
```

## 📋 Prerequisites

1. **WordPress Export File**: Export your WordPress content to XML
   - WordPress Admin → Tools → Export → All content
   - Save as `WordPress.2025-09-08.xml` (or update path in scripts)

2. **Sanity Project**: 
   - Set up Sanity project with blog schema
   - Get API token with write permissions

3. **Environment Variables**:
   ```bash
   SANITY_API_TOKEN=your_write_token_here
   NEXT_PUBLIC_SANITY_PROJECT_ID=4qp7h589
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

## 🛠️ Migration Process

### Step 1: Parse WordPress Export
```bash
npm run parse
```

**What it does:**
- Parses WordPress XML export file
- Extracts posts, pages, categories, authors, attachments
- Converts WordPress content to Sanity-compatible format
- Handles WordPress blocks and HTML content
- Preserves publication dates and metadata

**Output:** 
- `migration/data/posts.json` - All blog posts
- `migration/data/categories.json` - Post categories
- `migration/data/authors.json` - Author profiles
- `migration/data/attachments.json` - Media files
- `migration/data/redirects.json` - URL mappings

### Step 2: Download Images
```bash
npm run download-images
```

**What it does:**
- Downloads all WordPress images and attachments
- Creates optimized versions (thumbnail, medium, large)
- Generates image mapping for Sanity references
- Handles broken/missing images gracefully

**Output:**
- `migration/images/` - Downloaded image files
- `migration/data/image-mapping.json` - URL to file mapping
- `migration/data/image-download-results.json` - Download report

### Step 3: Import to Sanity
```bash
npm run import-sanity
```

**What it does:**
- Creates authors, categories, and posts in Sanity
- Uploads images to Sanity's CDN
- Updates image references in post content
- Preserves all metadata and relationships

**Requirements:**
- `SANITY_API_TOKEN` environment variable
- Write permissions on Sanity dataset

### Step 4: Generate Redirects
```bash
npm run generate-redirects
```

**What it does:**
- Creates Next.js redirects configuration
- Generates Apache .htaccess file
- Creates Vercel redirects config
- Maps old WordPress URLs to new post URLs

**Output:**
- Updates `next.config.ts` with redirects
- `migration/data/.htaccess` - Apache redirects
- `migration/data/vercel-redirects.json` - Vercel config

## 🎛️ Configuration Options

### Command Line Options
```bash
# Dry run (parse only, don't import)
node scripts/migrate.js --dry-run

# Skip image download
node scripts/migrate.js --skip-images

# Skip Sanity import
node scripts/migrate.js --skip-import

# Skip redirect generation
node scripts/migrate.js --skip-redirects
```

### WordPress Export Path
Update the file path in `scripts/parse-wordpress.js`:
```javascript
const WORDPRESS_XML_PATH = "/path/to/your/wordpress-export.xml";
```

## 📊 Migration Report

After migration, check these files for detailed reports:

- `migration-data.json` - Complete migration summary
- `image-download-results.json` - Image processing results
- `all-redirects.json` - All generated redirects

## 🔧 Troubleshooting

### Common Issues

**1. No posts found**
- Check WordPress export includes all content types
- Verify posts are published (not draft/trash)
- Check XML file path in parse script

**2. Sanity import fails**
- Verify `SANITY_API_TOKEN` has write permissions
- Check Sanity project ID and dataset
- Ensure Sanity schema matches expected types

**3. Images not downloading**
- Check original WordPress site is accessible
- Verify image URLs in WordPress export
- Check network connectivity and permissions

**4. Redirects not working**
- Verify Next.js config syntax
- Test redirect patterns
- Check deployment platform requirements

### Debug Mode
Run individual scripts with detailed logging:
```bash
node scripts/parse-wordpress.js
node scripts/download-images.js
node scripts/import-to-sanity.js
node scripts/generate-redirects.js
```

## 📁 File Structure

```
migration/
├── scripts/
│   ├── parse-wordpress.js      # WordPress XML parser
│   ├── download-images.js      # Image downloader
│   ├── import-to-sanity.js     # Sanity importer
│   ├── generate-redirects.js   # Redirect generator
│   └── migrate.js              # Main migration runner
├── data/                       # Generated migration data
├── images/                     # Downloaded images
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔍 Data Structure

### Posts
```json
{
  "_id": "post-123",
  "_type": "post",
  "title": "Blog Post Title",
  "slug": { "current": "blog-post-title" },
  "author": { "_type": "reference", "_ref": "author-1" },
  "publishedAt": "2023-01-01T00:00:00.000Z",
  "categories": [
    { "_type": "reference", "_ref": "category-1", "_key": "uuid" }
  ],
  "excerpt": "Post excerpt...",
  "body": [ /* Portable Text blocks */ ],
  "seo": {
    "title": "SEO Title",
    "description": "Meta description"
  },
  "_originalData": {
    "wordpressId": 123,
    "wordpressSlug": "original-slug",
    "wordpressUrl": "https://site.com/original-post"
  }
}
```

### Categories
```json
{
  "_id": "category-1",
  "_type": "category", 
  "title": "Category Name",
  "slug": { "current": "category-slug" },
  "description": "Category description"
}
```

## 🚀 Deployment Notes

### Next.js Redirects
The migration updates your `next.config.ts` with redirects:
```typescript
async redirects() {
  return [
    {
      source: '/old-wordpress-url',
      destination: '/posts/new-slug',
      permanent: true
    }
  ];
}
```

### Vercel Deployment
Add redirects to `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/old-url",
      "destination": "/posts/new-slug", 
      "statusCode": 301
    }
  ]
}
```

## 📝 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## 📞 Support

- Check migration logs for error details
- Review WordPress export file completeness
- Verify Sanity schema compatibility
- Test redirects after deployment
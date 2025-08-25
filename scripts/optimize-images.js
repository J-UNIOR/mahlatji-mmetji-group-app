const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration for image optimization
const OPTIMIZATION_CONFIG = {
  webp: {
    quality: 85,
    effort: 6,
    lossless: false
  },
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true
  },
  png: {
    quality: 85,
    compressionLevel: 9,
    palette: true
  }
};

// Responsive image sizes
const RESPONSIVE_SIZES = [480, 768, 1024, 1920];

const assetsPath = path.join(__dirname, '../src/assets/images');
const outputPath = assetsPath;

async function convertToWebP(imagePath, outputPath, quality = 85) {
  try {
    const inputBuffer = fs.readFileSync(imagePath);
    
    await sharp(inputBuffer)
      .webp({
        quality: quality,
        effort: 6,
        lossless: false
      })
      .toFile(outputPath);
      
    console.log(`✅ Converted: ${path.basename(imagePath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Failed to convert ${imagePath}:`, error.message);
  }
}

async function generateResponsiveImages(imagePath, baseName) {
  try {
    const inputBuffer = fs.readFileSync(imagePath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    
    console.log(`📏 Original size: ${metadata.width}x${metadata.height}`);
    
    // Generate responsive sizes
    for (const size of RESPONSIVE_SIZES) {
      if (size <= metadata.width) {
        // WebP version
        const webpOutput = path.join(outputPath, `${baseName}-${size}w.webp`);
        await image
          .clone()
          .resize(size, null, { withoutEnlargement: true })
          .webp(OPTIMIZATION_CONFIG.webp)
          .toFile(webpOutput);
        
        // JPEG version (fallback)
        const jpegOutput = path.join(outputPath, `${baseName}-${size}w.jpg`);
        await image
          .clone()
          .resize(size, null, { withoutEnlargement: true })
          .jpeg(OPTIMIZATION_CONFIG.jpeg)
          .toFile(jpegOutput);
          
        console.log(`🖼️  Generated responsive: ${baseName}-${size}w.webp & .jpg`);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to generate responsive images for ${imagePath}:`, error.message);
  }
}

async function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const imageFiles = [
    'banner-01.png',
    'banner-02.png', 
    'banner-03.png',
    'banner-04.png',
    'banner-01.jpg',
    'banner-02.jpg',
    'banner-03.jpg',
    'featured.jpg',
    'contact-bg.jpg',
    'deal-01.jpg',
    'deal-02.jpg',
    'property-01.jpg',
    'property-02.jpg',
    'property-03.jpg',
    'property-04.jpg',
    'property-05.jpg',
    'property-06.jpg',
    'video-bg.jpg',
    'page-heading-bg.jpg'
  ];
  
  for (const filename of imageFiles) {
    const imagePath = path.join(assetsPath, filename);
    
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(filename);
      const baseName = path.basename(filename, ext);
      
      // Convert to WebP
      const webpOutput = path.join(outputPath, `${baseName}.webp`);
      await convertToWebP(imagePath, webpOutput, 85);
      
      // Generate responsive images for banner images
      if (filename.includes('banner-')) {
        await generateResponsiveImages(imagePath, baseName);
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
    }
  }
  
  console.log('\n✨ Image optimization complete!');
  console.log('📊 Summary:');
  console.log('   • Converted images to WebP format');
  console.log('   • Generated responsive image sizes');
  console.log('   • Optimized compression settings');
}

// Run optimization
optimizeImages().catch(console.error);

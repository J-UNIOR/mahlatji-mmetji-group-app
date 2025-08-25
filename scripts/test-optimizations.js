const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Performance Optimizations\n');

// Test 1: Check if WebP images exist
console.log('1. WebP Image Conversion:');
const webpImages = [
  'banner-01.webp',
  'banner-02.webp', 
  'banner-03.webp',
  'banner-04.webp',
  'video-bg.webp',
  'contact-bg.webp',
  'page-heading-bg.webp'
];

const imagesDir = path.join(__dirname, '..', 'src', 'assets', 'images');
webpImages.forEach(image => {
  const imagePath = path.join(imagesDir, image);
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    console.log(`   ✅ ${image} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`   ❌ ${image} - Not found`);
  }
});

// Test 2: Check responsive images
console.log('\n2. Responsive Image Variants:');
const responsiveSizes = ['480w', '768w', '1024w', '1920w'];
const bannerImages = ['banner-01', 'banner-02', 'banner-03', 'banner-04'];

bannerImages.forEach(banner => {
  responsiveSizes.forEach(size => {
    const filename = `${banner}-${size}.webp`;
    const imagePath = path.join(imagesDir, filename);
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      console.log(`   ✅ ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
    }
  });
});

// Test 3: Check CSS WebP implementation
console.log('\n3. CSS WebP Implementation:');
const cssFile = path.join(__dirname, '..', 'src', 'assets', 'css', 'mahlatji-mmetji-group.css');
if (fs.existsSync(cssFile)) {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
  const webpUsages = cssContent.match(/\.webp/g);
  if (webpUsages) {
    console.log(`   ✅ Found ${webpUsages.length} WebP references in CSS`);
  } else {
    console.log('   ❌ No WebP references found in CSS');
  }
}

// Test 4: Check TypeScript files for optimization components
console.log('\n4. Optimization Components:');
const componentsToCheck = [
  'src/app/shared/directives/lazy-image.directive.ts',
  'src/app/shared/services/image-optimization.service.ts',
  'src/app/shared/components/optimized-image/optimized-image.component.ts'
];

componentsToCheck.forEach(componentPath => {
  const fullPath = path.join(__dirname, '..', componentPath);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${path.basename(componentPath)}`);
  } else {
    console.log(`   ❌ ${path.basename(componentPath)} - Not found`);
  }
});

// Test 5: Check bundle size from dist
console.log('\n5. Bundle Analysis:');
const distDir = path.join(__dirname, '..', 'dist', 'mahlatji-mmetji-group');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  const mainJs = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
  if (mainJs) {
    const mainPath = path.join(distDir, mainJs);
    const stats = fs.statSync(mainPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ Main bundle: ${mainJs} (${sizeKB} KB)`);
    
    if (parseFloat(sizeKB) < 140) {
      console.log('   🎉 Bundle size optimized! (Target: < 140 KB)');
    } else {
      console.log('   ⚠️  Bundle size could be further optimized');
    }
  }
} else {
  console.log('   ❌ No dist directory found. Run npm run build first.');
}

console.log('\n✨ Performance Optimization Test Complete!\n');

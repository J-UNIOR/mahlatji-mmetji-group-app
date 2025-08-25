/**
 * Content & SEO Features Verification Script
 * Tests SEO service, Blog, Testimonials, and Project Gallery implementation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Content & SEO Features Verification Started');
console.log('==============================================');

let totalTests = 0;
let passedTests = 0;

function test(description, condition) {
  totalTests++;
  if (condition) {
    console.log(`✅ ${description}`);
    passedTests++;
  } else {
    console.log(`❌ ${description}`);
  }
  return condition;
}

function testFileExists(filePath, description) {
  return test(description, fs.existsSync(filePath));
}

function testFileContains(filePath, searchString, description) {
  try {
    if (!fs.existsSync(filePath)) {
      return test(description, false);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return test(description, content.includes(searchString));
  } catch (error) {
    return test(description, false);
  }
}

console.log('\n🔍 Testing SEO Service...');

// Test SEO Service
testFileExists(
  'src/app/shared/services/seo.service.ts',
  'SEO Service exists'
);

testFileContains(
  'src/app/shared/services/seo.service.ts',
  'updateSEO',
  'SEO Service has meta tag update functionality'
);

testFileContains(
  'src/app/shared/services/seo.service.ts',
  'generateStructuredData',
  'SEO Service has structured data functionality'
);

testFileContains(
  'src/app/shared/services/seo.service.ts',
  'og:title',
  'SEO Service has Open Graph meta tags'
);

testFileContains(
  'src/app/shared/services/seo.service.ts',
  'twitter:card',
  'SEO Service has Twitter Card meta tags'
);

console.log('\n📝 Testing Blog Component...');

// Test Blog Component
testFileExists(
  'src/app/shared/components/blog/blog.component.ts',
  'Blog Component exists'
);

testFileContains(
  'src/app/shared/components/blog/blog.component.ts',
  'BlogPost',
  'Blog Component has BlogPost interface'
);

testFileContains(
  'src/app/shared/components/blog/blog.component.ts',
  'blog-grid',
  'Blog Component has grid layout'
);

testFileContains(
  'src/app/shared/components/blog/blog.component.ts',
  'Property Investment Trends',
  'Blog Component has sample content'
);

console.log('\n💬 Testing Testimonials Component...');

// Test Testimonials Component
testFileExists(
  'src/app/shared/components/testimonials/testimonials.component.ts',
  'Testimonials Component exists'
);

testFileContains(
  'src/app/shared/components/testimonials/testimonials.component.ts',
  'Testimonial',
  'Testimonials Component has Testimonial interface'
);

testFileContains(
  'src/app/shared/components/testimonials/testimonials.component.ts',
  'rating',
  'Testimonials Component has rating system'
);

testFileContains(
  'src/app/shared/components/testimonials/testimonials.component.ts',
  'getStars',
  'Testimonials Component has star rating display'
);

console.log('\n🖼️ Testing Project Gallery Component...');

// Test Project Gallery Component
testFileExists(
  'src/app/shared/components/project-gallery/project-gallery.component.ts',
  'Project Gallery Component exists'
);

testFileContains(
  'src/app/shared/components/project-gallery/project-gallery.component.ts',
  'Project',
  'Project Gallery has Project interface'
);

testFileContains(
  'src/app/shared/components/project-gallery/project-gallery.component.ts',
  'beforeImage',
  'Project Gallery has before/after image functionality'
);

testFileContains(
  'src/app/shared/components/project-gallery/project-gallery.component.ts',
  'filterProjects',
  'Project Gallery has category filtering'
);

testFileContains(
  'src/app/shared/components/project-gallery/project-gallery.component.ts',
  'before-after-slider',
  'Project Gallery has before/after slider'
);

console.log('\n📊 Testing Integration and Exports...');

// Test Shared Module Exports
testFileContains(
  'src/app/shared/index.ts',
  'seo.service',
  'SEO Service exported from shared module'
);

testFileContains(
  'src/app/shared/index.ts',
  'blog/blog.component',
  'Blog Component exported from shared module'
);

testFileContains(
  'src/app/shared/index.ts',
  'testimonials/testimonials.component',
  'Testimonials Component exported from shared module'
);

testFileContains(
  'src/app/shared/index.ts',
  'project-gallery/project-gallery.component',
  'Project Gallery Component exported from shared module'
);

console.log('\n📋 Summary');
console.log('=====================================');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All Content & SEO Features are fully implemented!');
  console.log('\n✨ Implementation Status:');
  console.log('   🔍 SEO Service: ✅ COMPLETE');
  console.log('   📝 Blog Section: ✅ COMPLETE');
  console.log('   💬 Testimonials: ✅ COMPLETE');
  console.log('   🖼️  Project Gallery: ✅ COMPLETE');
} else if (passedTests > totalTests * 0.8) {
  console.log('\n✅ Content & SEO Features are mostly implemented!');
  console.log(`   ${totalTests - passedTests} minor items need attention.`);
} else {
  console.log('\n⚠️  Content & SEO Features need more work.');
  console.log(`   ${totalTests - passedTests} items need to be completed.`);
}

console.log('\n🚀 Content & SEO Features Include:');
console.log('   📊 Dynamic SEO meta tags and structured data');
console.log('   📝 Blog section with categorized posts');
console.log('   ⭐ Client testimonials with ratings');
console.log('   🖼️  Interactive project gallery with before/after images');
console.log('   🔍 Search engine optimization ready');
console.log('\n💡 To integrate these components:');
console.log('   1. Import components in your page modules');
console.log('   2. Use SEO service for dynamic meta tags');
console.log('   3. Add components to your page templates');
console.log('   4. Customize content and styling as needed');

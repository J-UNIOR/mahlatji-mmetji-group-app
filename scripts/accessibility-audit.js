const fs = require('fs');
const path = require('path');

console.log('🔍 Accessibility Audit Report\n');
console.log('=' .repeat(60));

// Check for accessibility features
const accessibilityFeatures = {
  ariaLabels: 0,
  altTexts: 0,
  semanticElements: 0,
  formLabels: 0,
  keyboardNavigation: 0,
  focusManagement: 0,
  colorContrast: 0,
  errors: []
};

// Function to check a file for accessibility features
function checkFileAccessibility(filePath, type) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count ARIA attributes
  const ariaMatches = content.match(/aria-\w+=/g);
  if (ariaMatches) {
    accessibilityFeatures.ariaLabels += ariaMatches.length;
  }
  
  // Count alt attributes
  const altMatches = content.match(/alt\s*=\s*["'][^"']*["']/g);
  if (altMatches) {
    accessibilityFeatures.altTexts += altMatches.length;
  }
  
  // Count semantic elements
  const semanticElements = ['main', 'nav', 'header', 'footer', 'section', 'article', 'aside'];
  semanticElements.forEach(element => {
    const regex = new RegExp(`<${element}[^>]*>`, 'g');
    const matches = content.match(regex);
    if (matches) {
      accessibilityFeatures.semanticElements += matches.length;
    }
  });
  
  // Count form labels
  const labelMatches = content.match(/<label[^>]*for\s*=\s*["'][^"']*["'][^>]*>/g);
  if (labelMatches) {
    accessibilityFeatures.formLabels += labelMatches.length;
  }
  
  // Check for keyboard navigation
  const keyboardFeatures = ['tabindex', 'role=', 'onkeydown', 'onkeyup', 'onfocus'];
  keyboardFeatures.forEach(feature => {
    if (content.includes(feature)) {
      accessibilityFeatures.keyboardNavigation++;
    }
  });
  
  // Check for missing alt text
  const imgsWithoutAlt = content.match(/<img(?![^>]*alt\s*=)[^>]*>/g);
  if (imgsWithoutAlt) {
    accessibilityFeatures.errors.push(`${path.basename(filePath)}: ${imgsWithoutAlt.length} images missing alt text`);
  }
  
  // Check for unlabeled form inputs
  const inputsWithoutLabels = content.match(/<input(?![^>]*id\s*=\s*["'][^"']*["'])[^>]*type\s*=\s*["'](text|email|tel|password)["'][^>]*>/g);
  if (inputsWithoutLabels) {
    accessibilityFeatures.errors.push(`${path.basename(filePath)}: ${inputsWithoutLabels.length} form inputs may lack proper labels`);
  }
}

console.log('📊 SCANNING FILES FOR ACCESSIBILITY...\n');

// Check main template files
const filesToCheck = [
  'src/app/shared/header/header.html',
  'src/app/shared/footer/footer.html',
  'src/app/pages/mahlatji-home/home.html',
  'src/app/pages/mahlatji-about/about.html',
  'src/app/pages/mahlatji-contact/contact.html',
  'src/app/pages/mahlatji-services/services.html',
  'src/app/pages/mahlatji-portfolio/projects.html',
  'src/app/pages/error-404/error-404.component.ts',
  'src/app/pages/error-500/error-500.component.ts'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  checkFileAccessibility(fullPath, path.extname(file));
});

// Display results
console.log('🎯 ACCESSIBILITY FEATURES FOUND:');
console.log('-'.repeat(40));
console.log(`✅ ARIA Labels: ${accessibilityFeatures.ariaLabels}`);
console.log(`🖼️  Alt Text Attributes: ${accessibilityFeatures.altTexts}`);
console.log(`🏗️  Semantic HTML Elements: ${accessibilityFeatures.semanticElements}`);
console.log(`📝 Form Labels: ${accessibilityFeatures.formLabels}`);
console.log(`⌨️  Keyboard Navigation Features: ${accessibilityFeatures.keyboardNavigation}`);

console.log('\n⚠️  ACCESSIBILITY ISSUES:');
console.log('-'.repeat(40));
if (accessibilityFeatures.errors.length === 0) {
  console.log('✅ No major accessibility issues detected!');
} else {
  accessibilityFeatures.errors.forEach(error => {
    console.log(`❌ ${error}`);
  });
}

// Accessibility score calculation
const totalFeatures = accessibilityFeatures.ariaLabels + 
                     accessibilityFeatures.altTexts + 
                     accessibilityFeatures.semanticElements + 
                     accessibilityFeatures.formLabels + 
                     accessibilityFeatures.keyboardNavigation;

console.log('\n📈 ACCESSIBILITY ASSESSMENT:');
console.log('-'.repeat(40));

// Scoring criteria
let score = 0;
let maxScore = 100;

// ARIA labels (20 points max)
score += Math.min(20, accessibilityFeatures.ariaLabels * 2);
console.log(`ARIA Labels: ${Math.min(20, accessibilityFeatures.ariaLabels * 2)}/20 points`);

// Alt text (20 points max)
score += Math.min(20, accessibilityFeatures.altTexts * 1);
console.log(`Alt Text: ${Math.min(20, accessibilityFeatures.altTexts * 1)}/20 points`);

// Semantic HTML (20 points max)
score += Math.min(20, accessibilityFeatures.semanticElements * 1);
console.log(`Semantic HTML: ${Math.min(20, accessibilityFeatures.semanticElements * 1)}/20 points`);

// Form labels (20 points max)
score += Math.min(20, accessibilityFeatures.formLabels * 2);
console.log(`Form Labels: ${Math.min(20, accessibilityFeatures.formLabels * 2)}/20 points`);

// Keyboard navigation (20 points max)
score += Math.min(20, accessibilityFeatures.keyboardNavigation * 3);
console.log(`Keyboard Navigation: ${Math.min(20, accessibilityFeatures.keyboardNavigation * 3)}/20 points`);

console.log(`\n🏆 OVERALL ACCESSIBILITY SCORE: ${score}/${maxScore}`);

if (score >= 80) {
  console.log('🎉 EXCELLENT - High accessibility compliance!');
} else if (score >= 60) {
  console.log('👍 GOOD - Decent accessibility features implemented');
} else if (score >= 40) {
  console.log('⚠️  FAIR - Some accessibility improvements needed');
} else {
  console.log('❌ POOR - Significant accessibility improvements required');
}

console.log('\n📋 ACCESSIBILITY CHECKLIST:');
console.log('-'.repeat(40));
console.log(`${accessibilityFeatures.ariaLabels > 0 ? '✅' : '❌'} ARIA labels for screen readers`);
console.log(`${accessibilityFeatures.altTexts > 10 ? '✅' : '❌'} Alt text for images`);
console.log(`${accessibilityFeatures.semanticElements > 15 ? '✅' : '❌'} Semantic HTML structure`);
console.log(`${accessibilityFeatures.formLabels > 0 ? '✅' : '❌'} Form field labels`);
console.log(`${accessibilityFeatures.keyboardNavigation > 5 ? '✅' : '❌'} Keyboard navigation support`);

console.log('\n🔧 RECOMMENDATIONS:');
console.log('-'.repeat(40));

if (accessibilityFeatures.ariaLabels < 10) {
  console.log('• Add more ARIA labels for navigation and interactive elements');
}
if (accessibilityFeatures.altTexts < 15) {
  console.log('• Ensure all images have descriptive alt text');
}
if (accessibilityFeatures.formLabels < 5) {
  console.log('• Add proper labels for all form inputs');
}
if (accessibilityFeatures.keyboardNavigation < 10) {
  console.log('• Implement better keyboard navigation and focus management');
}
if (accessibilityFeatures.errors.length > 0) {
  console.log('• Fix the accessibility issues listed above');
}

console.log('\n✨ Accessibility Audit Complete!\n');

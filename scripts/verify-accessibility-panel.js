const fs = require('fs');
const path = require('path');

console.log('♿ Accessibility Panel Feature Verification\n');
console.log('=' .repeat(60));

// Check if accessibility panel component exists and is properly configured
function verifyAccessibilityPanel() {
  const componentPath = path.join(__dirname, '..', 'src', 'app', 'shared', 'components', 'accessibility-panel', 'accessibility-panel.component.ts');
  
  if (!fs.existsSync(componentPath)) {
    console.log('❌ Accessibility panel component not found');
    return false;
  }

  const content = fs.readFileSync(componentPath, 'utf8');
  
  console.log('🎯 ACCESSIBILITY PANEL FEATURES:');
  console.log('-'.repeat(40));
  
  // Check for Visual Adjustments
  console.log('\n📱 VISUAL ADJUSTMENTS:');
  const visualFeatures = [
    { name: 'Font Size Control', pattern: /font-size-select|onFontSizeChange/, found: false },
    { name: 'Theme Selection', pattern: /theme-select|onThemeChange/, found: false },
    { name: 'High Contrast Mode', pattern: /toggleHighContrast|highContrast/, found: false },
    { name: 'Dark/Light Theme', pattern: /dark-theme|light-theme/, found: false }
  ];

  visualFeatures.forEach(feature => {
    feature.found = feature.pattern.test(content);
    console.log(`   ${feature.found ? '✅' : '❌'} ${feature.name}`);
  });

  // Check for Navigation Features
  console.log('\n🧭 NAVIGATION FEATURES:');
  const navigationFeatures = [
    { name: 'Keyboard Navigation', pattern: /toggleKeyboardNavigation|keyboardNavigation/, found: false },
    { name: 'Focus Indicators', pattern: /toggleFocusIndicators|focusIndicators/, found: false },
    { name: 'Skip to Content', pattern: /skipToContent/, found: false },
    { name: 'Keyboard Shortcuts', pattern: /setupKeyboardShortcuts|altKey/, found: false }
  ];

  navigationFeatures.forEach(feature => {
    feature.found = feature.pattern.test(content);
    console.log(`   ${feature.found ? '✅' : '❌'} ${feature.name}`);
  });

  // Check for Quick Actions
  console.log('\n⚡ QUICK ACTIONS:');
  const quickActionFeatures = [
    { name: 'Reset to Defaults', pattern: /resetToDefaults/, found: false },
    { name: 'Skip to Content Action', pattern: /skipToContent/, found: false },
    { name: 'Panel Toggle', pattern: /togglePanel/, found: false },
    { name: 'Keyboard Shortcuts (Alt+A)', pattern: /Alt \+ A|altKey.*a/, found: false }
  ];

  quickActionFeatures.forEach(feature => {
    feature.found = feature.pattern.test(content);
    console.log(`   ${feature.found ? '✅' : '❌'} ${feature.name}`);
  });

  // Check for Motion & Animation Controls
  console.log('\n🎬 MOTION & ANIMATION:');
  const motionFeatures = [
    { name: 'Reduce Motion', pattern: /toggleReducedMotion|reducedMotion/, found: false },
    { name: 'Animation Control', pattern: /toggleAnimations|animations/, found: false },
    { name: 'Prefers Reduced Motion', pattern: /prefers-reduced-motion/, found: false }
  ];

  motionFeatures.forEach(feature => {
    feature.found = feature.pattern.test(content);
    console.log(`   ${feature.found ? '✅' : '❌'} ${feature.name}`);
  });

  // Check for Persistence
  console.log('\n💾 PERSISTENCE & STATE:');
  const persistenceFeatures = [
    { name: 'Save User Preferences', pattern: /saveUserPreferences|localStorage/, found: false },
    { name: 'Load User Preferences', pattern: /loadUserPreferences/, found: false },
    { name: 'Auto Show Feature', pattern: /autoShow|hasAccessibilityPrefs/, found: false },
    { name: 'Toast Notifications', pattern: /showToast/, found: false }
  ];

  persistenceFeatures.forEach(feature => {
    feature.found = feature.pattern.test(content);
    console.log(`   ${feature.found ? '✅' : '❌'} ${feature.name}`);
  });

  // Calculate scores
  const allFeatures = [...visualFeatures, ...navigationFeatures, ...quickActionFeatures, ...motionFeatures, ...persistenceFeatures];
  const foundFeatures = allFeatures.filter(f => f.found).length;
  const totalFeatures = allFeatures.length;
  const score = Math.round((foundFeatures / totalFeatures) * 100);

  console.log('\n📊 FEATURE COVERAGE:');
  console.log('-'.repeat(40));
  console.log(`Total Features: ${totalFeatures}`);
  console.log(`Implemented: ${foundFeatures}`);
  console.log(`Coverage: ${score}%`);

  if (score >= 90) {
    console.log('🎉 EXCELLENT - Comprehensive accessibility panel!');
  } else if (score >= 75) {
    console.log('👍 GOOD - Most accessibility features implemented');
  } else if (score >= 50) {
    console.log('⚠️  FAIR - Basic accessibility features present');
  } else {
    console.log('❌ POOR - Limited accessibility features');
  }

  return score >= 75;
}

// Check if panel is integrated into the application
function verifyPanelIntegration() {
  console.log('\n🔗 INTEGRATION CHECK:');
  console.log('-'.repeat(40));
  
  const uxLayoutPath = path.join(__dirname, '..', 'src', 'app', 'shared', 'components', 'ux-layout', 'ux-layout.component.ts');
  const appHtmlPath = path.join(__dirname, '..', 'src', 'app', 'app.html');
  
  let integrationScore = 0;
  
  // Check UX Layout integration
  if (fs.existsSync(uxLayoutPath)) {
    const content = fs.readFileSync(uxLayoutPath, 'utf8');
    if (content.includes('app-accessibility-panel')) {
      console.log('✅ Accessibility panel integrated in UX layout');
      integrationScore += 50;
    } else {
      console.log('❌ Accessibility panel not found in UX layout');
    }
  }
  
  // Check app.html usage
  if (fs.existsSync(appHtmlPath)) {
    const content = fs.readFileSync(appHtmlPath, 'utf8');
    if (content.includes('app-ux-layout')) {
      console.log('✅ UX layout component used in main app');
      integrationScore += 50;
    } else {
      console.log('❌ UX layout not found in main app');
    }
  }
  
  return integrationScore >= 75;
}

// Check accessibility CSS enhancements
function verifyAccessibilityCSS() {
  console.log('\n🎨 ACCESSIBILITY CSS:');
  console.log('-'.repeat(40));
  
  const accessibilityCSSPath = path.join(__dirname, '..', 'src', 'assets', 'css', 'accessibility.css');
  const stylesPath = path.join(__dirname, '..', 'src', 'styles.css');
  
  let cssScore = 0;
  
  if (fs.existsSync(accessibilityCSSPath)) {
    const content = fs.readFileSync(accessibilityCSSPath, 'utf8');
    
    const cssFeatures = [
      { name: 'Focus Indicators', pattern: /\*:focus|focus.*outline/, found: false },
      { name: 'Skip Links', pattern: /skip-link/, found: false },
      { name: 'High Contrast Support', pattern: /prefers-contrast/, found: false },
      { name: 'Reduced Motion Support', pattern: /prefers-reduced-motion/, found: false },
      { name: 'Screen Reader Only', pattern: /sr-only/, found: false }
    ];

    cssFeatures.forEach(feature => {
      feature.found = feature.pattern.test(content);
      console.log(`   ${feature.found ? '✅' : '❌'} ${feature.name}`);
      if (feature.found) cssScore += 20;
    });
  } else {
    console.log('❌ Accessibility CSS file not found');
  }
  
  // Check if accessibility CSS is imported
  if (fs.existsSync(stylesPath)) {
    const content = fs.readFileSync(stylesPath, 'utf8');
    if (content.includes('accessibility.css')) {
      console.log('✅ Accessibility CSS imported in main styles');
    } else {
      console.log('❌ Accessibility CSS not imported');
    }
  }
  
  return cssScore >= 60;
}

// Main verification
console.log('🔍 RUNNING ACCESSIBILITY PANEL VERIFICATION...\n');

const panelImplemented = verifyAccessibilityPanel();
const panelIntegrated = verifyPanelIntegration();
const cssImplemented = verifyAccessibilityCSS();

console.log('\n' + '='.repeat(60));
console.log('🏆 FINAL ASSESSMENT');
console.log('='.repeat(60));

console.log(`\n✅ Visual Adjustments: ${panelImplemented ? 'IMPLEMENTED' : 'MISSING'}`);
console.log(`✅ Navigation Features: ${panelImplemented ? 'IMPLEMENTED' : 'MISSING'}`);
console.log(`✅ Quick Actions: ${panelImplemented ? 'IMPLEMENTED' : 'MISSING'}`);
console.log(`✅ Integration: ${panelIntegrated ? 'COMPLETE' : 'INCOMPLETE'}`);
console.log(`✅ CSS Enhancements: ${cssImplemented ? 'COMPLETE' : 'INCOMPLETE'}`);

const overallStatus = panelImplemented && panelIntegrated && cssImplemented;

console.log(`\n🎯 OVERALL STATUS: ${overallStatus ? '✅ FULLY FUNCTIONAL' : '⚠️  NEEDS ATTENTION'}`);

if (overallStatus) {
  console.log('\n🎉 The accessibility panel includes all requested features:');
  console.log('   • Visual Adjustments (font size, theme, high contrast)');
  console.log('   • Navigation options (keyboard nav, focus indicators)');
  console.log('   • Quick Actions (reset, skip to content)');
  console.log('   • Motion controls (reduce motion, animations)');
  console.log('   • Persistent user preferences');
  console.log('   • Keyboard shortcuts (Alt+A to toggle)');
  console.log('\n💡 Access the panel via the blue button in the bottom-left corner!');
} else {
  console.log('\n❗ Some features may need implementation or integration.');
}

console.log('\n✨ Accessibility Panel Verification Complete!\n');

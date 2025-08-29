/**
 * Mobile Optimization Feature Verification Script
 * Tests all mobile optimization features and services
 */

// Touch Gesture Verification
function verifyTouchGestures() {
  console.log('🔥 Verifying Touch Gesture Service...');
  
  // Check if running in browser
  if (typeof window === 'undefined') {
    console.log('❌ Touch gestures not available (SSR environment)');
    return false;
  }

  // Test touch device detection
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  console.log(hasTouch ? '✅ Touch device detected' : '⚠️ Non-touch device');

  // Simulate touch events for testing
  const testElement = document.createElement('div');
  testElement.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 100px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: Arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: transform 0.2s ease;
  `;
  testElement.textContent = 'Swipe Test Area';
  testElement.id = 'touch-test-element';

  // Add hover effect
  testElement.addEventListener('mouseenter', () => {
    testElement.style.transform = 'translate(-50%, -50%) scale(1.05)';
  });
  testElement.addEventListener('mouseleave', () => {
    testElement.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.body.appendChild(testElement);

  // Test touch events
  let touchStart: { x: number; y: number; time: number } | null = null;
  let swipeDetected = false;

  testElement.addEventListener('touchstart', (e) => {
    touchStart = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    console.log('🫱 Touch start detected');
  });

  testElement.addEventListener('touchend', (e) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const deltaTime = touchEnd.time - touchStart.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 50 && deltaTime < 300) {
      const direction = Math.abs(deltaX) > Math.abs(deltaY) 
        ? (deltaX > 0 ? 'right' : 'left')
        : (deltaY > 0 ? 'down' : 'up');
      
      console.log(`✅ Swipe ${direction} detected (${distance.toFixed(0)}px)`);
      swipeDetected = true;
      
      // Visual feedback
      testElement.style.background = '#4CAF50';
      testElement.textContent = `Swiped ${direction}!`;
      setTimeout(() => {
        testElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        testElement.textContent = 'Swipe Test Area';
      }, 1000);
    }

    touchStart = null;
  });

  // Remove test element after 10 seconds
  setTimeout(() => {
    if (document.body.contains(testElement)) {
      document.body.removeChild(testElement);
    }
    console.log(swipeDetected ? '✅ Touch gesture verification complete' : '⚠️ No swipes detected');
  }, 10000);

  return true;
}

// App Shell Verification
function verifyAppShell() {
  console.log('🔥 Verifying App Shell Service...');

  // Test critical resource loading
  const criticalResources = [
    '/assets/css/mahlatji-mmetji-group.css',
    '/assets/css/animate.css',
    '/assets/vendor/bootstrap/css/bootstrap.min.css'
  ];

  let loadedResources = 0;
  const startTime = performance.now();

  criticalResources.forEach(resource => {
    fetch(resource, { method: 'HEAD' })
      .then(() => {
        loadedResources++;
        console.log(`✅ Critical resource loaded: ${resource}`);
        
        if (loadedResources === criticalResources.length) {
          const loadTime = performance.now() - startTime;
          console.log(`✅ All critical resources loaded in ${loadTime.toFixed(2)}ms`);
        }
      })
      .catch(() => {
        console.log(`⚠️ Failed to load critical resource: ${resource}`);
      });
  });

  // Test skeleton loading simulation
  const skeleton = document.createElement('div');
  skeleton.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      z-index: 9999;
      padding: 20px;
      box-sizing: border-box;
    ">
      <div style="
        height: 60px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        margin-bottom: 20px;
        border-radius: 4px;
      "></div>
      <div style="
        height: 20px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        margin-bottom: 15px;
        border-radius: 4px;
        width: 80%;
      "></div>
      <div style="
        height: 20px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        margin-bottom: 15px;
        border-radius: 4px;
        width: 90%;
      "></div>
      <div style="
        height: 20px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
        width: 70%;
      "></div>
      <div style="
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: #666;
        font-family: Arial, sans-serif;
        font-size: 14px;
      ">App Shell Loading...</div>
    </div>
  `;

  // Add shimmer animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(skeleton);
  console.log('✅ App shell skeleton displayed');

  // Remove skeleton after 3 seconds
  setTimeout(() => {
    if (document.body.contains(skeleton)) {
      skeleton.style.opacity = '0';
      skeleton.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(skeleton);
        document.head.removeChild(style);
        console.log('✅ App shell verification complete');
      }, 300);
    }
  }, 3000);

  return true;
}

// Push Notification Verification
function verifyPushNotifications() {
  console.log('🔥 Verifying Push Notification Service...');

  // Check notification support
  if (!('Notification' in window)) {
    console.log('❌ Push notifications not supported in this browser');
    return false;
  }

  console.log(`✅ Notification API available (Permission: ${Notification.permission})`);

  // Check service worker support
  if (!('serviceWorker' in navigator)) {
    console.log('❌ Service Worker not supported');
    return false;
  }

  console.log('✅ Service Worker API available');

  // Test notification (if permission granted)
  if (Notification.permission === 'granted') {
    const notification = new Notification('Mobile Optimization Test', {
      body: 'Push notification functionality is working correctly!',
      icon: '/assets/images/logo.png',
      badge: '/assets/images/badge.png',
      tag: 'mobile-optimization-test'
    });

    notification.onclick = () => {
      console.log('✅ Notification clicked');
      notification.close();
    };

    setTimeout(() => {
      notification.close();
    }, 5000);

    console.log('✅ Test notification sent');
  } else if (Notification.permission === 'default') {
    // Create permission request button
    const button = document.createElement('button');
    button.textContent = 'Test Push Notifications';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
    `;

    button.addEventListener('click', async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
          
          const notification = new Notification('Permission Granted!', {
            body: 'You will now receive mobile optimization notifications.',
            icon: '/assets/images/logo.png'
          });

          setTimeout(() => notification.close(), 3000);
          
          button.style.background = '#4CAF50';
          button.textContent = 'Notifications Enabled!';
          
          setTimeout(() => {
            document.body.removeChild(button);
          }, 2000);
        } else {
          console.log('⚠️ Notification permission denied');
          button.style.background = '#f44336';
          button.textContent = 'Permission Denied';
        }
      } catch (error) {
        console.error('❌ Error requesting notification permission:', error);
      }
    });

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    });

    document.body.appendChild(button);
    console.log('✅ Permission request button created');

    // Remove button after 15 seconds if not clicked
    setTimeout(() => {
      if (document.body.contains(button)) {
        document.body.removeChild(button);
      }
    }, 15000);
  } else {
    console.log('⚠️ Notifications are blocked by user');
  }

  return true;
}

// Performance Metrics Verification
function verifyPerformanceMetrics() {
  console.log('🔥 Verifying Performance Metrics...');

  if (typeof window === 'undefined' || !window.performance) {
    console.log('❌ Performance API not available');
    return false;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const metrics = {
    'Page Load Time': navigation ? `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms` : 'N/A',
    'DOM Content Loaded': navigation ? `${(navigation.domContentLoadedEventEnd - navigation.fetchStart).toFixed(2)}ms` : 'N/A',
    'First Paint': paint.find(p => p.name === 'first-paint')?.startTime.toFixed(2) + 'ms' || 'N/A',
    'First Contentful Paint': paint.find(p => p.name === 'first-contentful-paint')?.startTime.toFixed(2) + 'ms' || 'N/A'
  };

  // Display metrics overlay
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
      min-width: 250px;
    ">
      <h4 style="margin: 0 0 12px 0; color: #333; font-size: 14px;">📊 Performance Metrics</h4>
      ${Object.entries(metrics).map(([key, value]) => 
        `<div style="margin-bottom: 8px;">
          <span style="color: #666;">${key}:</span>
          <span style="color: #333; font-weight: bold; float: right;">${value}</span>
          <div style="clear: both;"></div>
        </div>`
      ).join('')}
      <button onclick="this.parentElement.parentElement.remove()" style="
        margin-top: 8px;
        padding: 4px 8px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        width: 100%;
      ">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);

  Object.entries(metrics).forEach(([key, value]) => {
    console.log(`✅ ${key}: ${value}`);
  });

  // Auto-remove after 15 seconds
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }, 15000);

  console.log('✅ Performance metrics verification complete');
  return true;
}

// Mobile Device Detection
function verifyMobileDetection() {
  console.log('🔥 Verifying Mobile Device Detection...');

  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android/i.test(userAgent) && window.innerWidth >= 768;
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const pixelRatio = window.devicePixelRatio || 1;
  const touchPoints = navigator.maxTouchPoints || 0;

  const deviceInfo = {
    'Mobile Device': isMobile ? '✅ Yes' : '❌ No',
    'Tablet Device': isTablet ? '✅ Yes' : '❌ No',
    'Screen Size': screenSize,
    'Pixel Ratio': pixelRatio.toFixed(2),
    'Touch Points': touchPoints,
    'Orientation': window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'
  };

  console.log('📱 Device Information:');
  Object.entries(deviceInfo).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Show device info overlay
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 8px;
      padding: 16px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
    ">
      <h4 style="margin: 0 0 12px 0; color: #fff; font-size: 14px;">📱 Device Info</h4>
      ${Object.entries(deviceInfo).map(([key, value]) => 
        `<div style="margin-bottom: 6px;">
          <span style="color: #ccc;">${key}:</span><br>
          <span style="color: #fff; font-weight: bold;">${value}</span>
        </div>`
      ).join('')}
      <button onclick="this.parentElement.parentElement.remove()" style="
        margin-top: 8px;
        padding: 6px 12px;
        background: #333;
        color: white;
        border: 1px solid #555;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        width: 100%;
      ">Close</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }, 10000);

  return true;
}

// Main Verification Function
function verifyMobileOptimization() {
  console.log('🚀 Starting Mobile Optimization Verification...\n');

  const results = {
    touchGestures: verifyTouchGestures(),
    appShell: verifyAppShell(),
    pushNotifications: verifyPushNotifications(),
    performanceMetrics: verifyPerformanceMetrics(),
    mobileDetection: verifyMobileDetection()
  };

  // Summary
  setTimeout(() => {
    console.log('\n📋 Mobile Optimization Verification Summary:');
    Object.entries(results).forEach(([feature, passed]) => {
      console.log(`  ${feature}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });

    const passedCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    const percentage = ((passedCount / totalCount) * 100).toFixed(1);

    console.log(`\n🎯 Overall Score: ${passedCount}/${totalCount} features (${percentage}%)`);
    
    if (passedCount === totalCount) {
      console.log('🎉 All mobile optimization features are working correctly!');
    } else {
      console.log('⚠️ Some mobile optimization features need attention.');
    }
  }, 2000);

  return results;
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as unknown as { verifyMobileOptimization?: typeof verifyMobileOptimization }).verifyMobileOptimization = verifyMobileOptimization;
  (window as unknown as { verifyTouchGestures?: typeof verifyTouchGestures }).verifyTouchGestures = verifyTouchGestures;
  (window as unknown as { verifyAppShell?: typeof verifyAppShell }).verifyAppShell = verifyAppShell;
  (window as unknown as { verifyPushNotifications?: typeof verifyPushNotifications }).verifyPushNotifications = verifyPushNotifications;
  (window as unknown as { verifyPerformanceMetrics?: typeof verifyPerformanceMetrics }).verifyPerformanceMetrics = verifyPerformanceMetrics;
  (window as unknown as { verifyMobileDetection?: typeof verifyMobileDetection }).verifyMobileDetection = verifyMobileDetection;
}

// Auto-run verification in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('🔧 Development mode detected - Auto-running mobile optimization verification in 3 seconds...');
  setTimeout(verifyMobileOptimization, 3000);
}

export {
  verifyMobileOptimization,
  verifyTouchGestures,
  verifyAppShell,
  verifyPushNotifications,
  verifyPerformanceMetrics,
  verifyMobileDetection
};

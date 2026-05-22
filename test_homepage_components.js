// Test to verify homepage component registration
const fs = require('fs');
const path = require('path');

// Test that index.json contains all required component registrations
function testHomepageComponentRegistration() {
  const indexPath = '/Users/adder.chia/programs/github/minipro/birds/miniprogram/pages/index/index.json';

  try {
    const jsonData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

    // Expected components
    const expectedComponents = [
      'activity-panel',
      'bird-identification-game',
      'bird-knowledge-quiz',
      'checkin-activity'
    ];

    // Expected paths
    const expectedPaths = {
      'activity-panel': '/miniprogram/components/activity-panel/activity-panel',
      'bird-identification-game': '/miniprogram/components/bird-game/bird-identification-game',
      'bird-knowledge-quiz': '/miniprogram/components/bird-quiz/bird-knowledge-quiz',
      'checkin-activity': '/miniprogram/components/checkin-activity/checkin-activity'
    };

    // Check if usingComponents exists
    if (!jsonData.usingComponents) {
      console.error('FAIL: usingComponents not found in index.json');
      return false;
    }

    // Check if all expected components are registered
    for (const component of expectedComponents) {
      if (!jsonData.usingComponents[component]) {
        console.error(`FAIL: Component ${component} not registered in usingComponents`);
        return false;
      }

      // Check if path is correct
      if (jsonData.usingComponents[component] !== expectedPaths[component]) {
        console.error(`FAIL: Component ${component} has incorrect path. Expected: ${expectedPaths[component]}, Got: ${jsonData.usingComponents[component]}`);
        return false;
      }
    }

    // Verify all registered components exist as files
    for (const [componentName, componentPath] of Object.entries(jsonData.usingComponents)) {
      const fullPath = path.join('/Users/adder.chia/programs/github/minipro/birds', componentPath + '.js');
      if (!fs.existsSync(fullPath)) {
        console.error(`FAIL: Component file does not exist: ${fullPath}`);
        return false;
      }
    }

    console.log('PASS: All components are properly registered in index.json');
    return true;
  } catch (error) {
    console.error('FAIL: Error reading or parsing index.json:', error.message);
    return false;
  }
}

// Run the test
const testPassed = testHomepageComponentRegistration();
process.exit(testPassed ? 0 : 1);
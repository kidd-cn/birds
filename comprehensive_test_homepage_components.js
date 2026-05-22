// More comprehensive test to verify homepage component registration and functionality
const fs = require('fs');
const path = require('path');

function testAllComponentsExistAndAreRegistered() {
  const indexPath = '/Users/adder.chia/programs/github/minipro/birds/miniprogram/pages/index/index.json';

  try {
    const jsonData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

    const componentsToTest = {
      'activity-panel': '/miniprogram/components/activity-panel/activity-panel',
      'bird-identification-game': '/miniprogram/components/bird-game/bird-identification-game',
      'bird-knowledge-quiz': '/miniprogram/components/bird-quiz/bird-knowledge-quiz',
      'checkin-activity': '/miniprogram/components/checkin-activity/checkin-activity'
    };

    let allTestsPassed = true;

    // Test each component is registered with correct path
    for (const [componentName, expectedPath] of Object.entries(componentsToTest)) {
      if (!jsonData.usingComponents || !jsonData.usingComponents[componentName]) {
        console.error(`FAIL: Component ${componentName} not found in usingComponents`);
        allTestsPassed = false;
        continue;
      }

      if (jsonData.usingComponents[componentName] !== expectedPath) {
        console.error(`FAIL: Component ${componentName} has incorrect path. Expected: ${expectedPath}, Got: ${jsonData.usingComponents[componentName]}`);
        allTestsPassed = false;
        continue;
      }

      // Test that component files exist
      const basePath = jsonData.usingComponents[componentName];
      const jsFile = path.join('/Users/adder.chia/programs/github/minipro/birds', basePath + '.js');
      const jsonFile = path.join('/Users/adder.chia/programs/github/minipro/birds', basePath + '.json');
      const wxmlFile = path.join('/Users/adder.chia/programs/github/minipro/birds', basePath + '.wxml');
      const wxssFile = path.join('/Users/adder.chia/programs/github/minipro/birds', basePath + '.wxss');

      const filesToCheck = [jsFile, jsonFile, wxmlFile, wxssFile];

      for (const file of filesToCheck) {
        if (!fs.existsSync(file)) {
          console.error(`FAIL: Component file missing: ${file}`);
          allTestsPassed = false;
        }
      }

      // Test that component JSON has proper configuration
      if (fs.existsSync(jsonFile)) {
        try {
          const componentJson = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
          if (componentJson.component !== true) {
            console.error(`FAIL: Component ${componentName} JSON does not have 'component: true' setting`);
            allTestsPassed = false;
          }
        } catch (parseError) {
          console.error(`FAIL: Cannot parse component JSON file ${jsonFile}: ${parseError.message}`);
          allTestsPassed = false;
        }
      }
    }

    if (allTestsPassed) {
      console.log('SUCCESS: All components are properly registered and files exist');
      return true;
    } else {
      console.log('FAILURE: Some components are not properly registered or files are missing');
      return false;
    }
  } catch (error) {
    console.error('FAIL: Error reading or parsing index.json:', error.message);
    return false;
  }
}

// Run the test
const result = testAllComponentsExistAndAreRegistered();
process.exit(result ? 0 : 1);
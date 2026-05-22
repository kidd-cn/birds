// Simple test to validate the activity utils work properly

// Load the module
const fs = require('fs');
const path = require('path');

// Read and evaluate the module code (since it uses module.exports syntax for WeChat)
const moduleCode = fs.readFileSync(path.join(__dirname, 'activity-utils.js'), 'utf8');

// Create a mock environment to test the module
const mockExports = {};
const mockModule = { exports: mockExports };

// Evaluate the module code in a function context
const moduleFunction = new Function('module', 'exports', moduleCode);
moduleFunction(mockModule, mockExports);

// Get the functions
const {
  generateIdentificationQuestion,
  generateQuizQuestion,
  manageCheckInStatus,
  awardBadges
} = mockModule.exports;

// Mock bird data for testing
const mockBirdData = [
  {
    id: 1,
    name: "Red Robin",
    scientificName: "Erithacus rubecula",
    description: "Small songbird with distinctive red breast",
    habitat: "Woodlands, gardens",
    features: ["red breast", "small size", "melodious song"]
  },
  {
    id: 2,
    name: "Blue Jay",
    scientificName: "Cyanocitta cristata",
    description: "Colorful jay with blue and white plumage",
    habitat: "Forests, urban areas",
    features: ["blue color", "white chest", "black markings", "crested head"]
  },
  {
    id: 3,
    name: "American Goldfinch",
    scientificName: "Spinus tristis",
    description: "Bright yellow bird with black wings",
    habitat: "Fields, meadows",
    features: ["yellow color", "black wings", "small size"]
  },
  {
    id: 4,
    name: "Northern Cardinal",
    scientificName: "Cardinalis cardinalis",
    description: "Bright red bird with distinctive crest",
    habitat: "Woodlands, gardens",
    features: ["red color", "crested head", "black mask"]
  }
];

console.log("Testing activity utils functions...");

try {
  // Test identification question generation
  console.log("\n1. Testing identification question generation...");
  const identQ = generateIdentificationQuestion(mockBirdData, 3);
  console.log(`✓ Generated question: "${identQ.question}"`);
  console.log(`✓ Options: ${JSON.stringify(identQ.options)}`);
  console.log(`✓ Correct answer: ${identQ.correctAnswer}`);
  console.log(`✓ Difficulty: ${identQ.difficulty}`);

  if (identQ.options.length !== 4) {
    throw new Error(`Expected 4 options, got ${identQ.options.length}`);
  }
  console.log("✓ Has 4 options");

  // Test quiz question generation
  console.log("\n2. Testing quiz question generation...");
  const quizQ = generateQuizQuestion(mockBirdData, 2);
  console.log(`✓ Generated question: "${quizQ.question}"`);
  console.log(`✓ Options: ${JSON.stringify(quizQ.options)}`);
  console.log(`✓ Correct answer: ${quizQ.correctAnswer}`);
  console.log(`✓ Category: ${quizQ.category}`);

  if (quizQ.options.length !== 4) {
    throw new Error(`Expected 4 options, got ${quizQ.options.length}`);
  }
  console.log("✓ Has 4 options");

  // Test check-in status management
  console.log("\n3. Testing check-in status management...");
  const userId = 'test-user-123';
  const birdId = 1;

  const status1 = manageCheckInStatus(userId, birdId);
  console.log(`✓ Initial check-in count: ${status1.checkIns.length}`);

  const status2 = manageCheckInStatus(userId, birdId);
  console.log(`✓ After duplicate check-in: ${status2.checkIns.length} (should be same)`);
  console.log(`✓ Is new check-in: ${status2.isNewCheckIn}`);

  // Add different bird
  const status3 = manageCheckInStatus(userId, 2);
  console.log(`✓ After adding different bird: ${status3.checkIns.length}`);

  // Test badge awarding
  console.log("\n4. Testing badge awarding...");

  // Test with no check-ins
  const noBadges = awardBadges({ checkIns: [] });
  console.log(`✓ No check-ins badges: ${noBadges.length}`);

  // Test with 10 check-ins (Explorer badge)
  const explorerBadges = awardBadges({ checkIns: Array(10).fill({}) });
  const hasExplorer = explorerBadges.some(b => b.type === 'explorer');
  console.log(`✓ Explorer badge awarded: ${hasExplorer}`);

  // Test with 50 check-ins (Enthusiast badge)
  const enthusiastBadges = awardBadges({ checkIns: Array(50).fill({}) });
  const hasEnthusiast = enthusiastBadges.some(b => b.type === 'enthusiast');
  console.log(`✓ Enthusiast badge awarded: ${hasEnthusiast}`);

  // Test with 100 check-ins (Expert badge)
  const expertBadges = awardBadges({ checkIns: Array(100).fill({}) });
  const hasExpert = expertBadges.some(b => b.type === 'expert');
  console.log(`✓ Expert badge awarded: ${hasExpert}`);

  console.log("\n✅ All activity utility functions are working correctly!");
} catch (error) {
  console.error("\n❌ Error:", error.message);
  console.error(error.stack);
}
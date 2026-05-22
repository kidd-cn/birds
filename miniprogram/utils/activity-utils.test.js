// Test file for activity-utils.js

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
  }
];

// Simple assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Test runner
function runTests() {
  try {
    // Test generateIdentificationQuestion function
    console.log('Testing generateIdentificationQuestion...');

    const question1 = generateIdentificationQuestion(mockBirdData, 1);
    assert(question1.question.includes('Which bird'), 'Question should be an identification question');
    assert(question1.options.length === 4, 'Should have 4 options');
    assert(question1.correctAnswer, 'Should have correct answer');
    console.log('✓ generateIdentificationQuestion basic test passed');

    const question5 = generateIdentificationQuestion(mockBirdData, 5);
    assert(question5.difficulty >= 4, 'High difficulty should have challenging distractors');
    console.log('✓ generateIdentificationQuestion difficulty test passed');

    // Test generateQuizQuestion function
    console.log('Testing generateQuizQuestion...');

    const quizQuestion = generateQuizQuestion(mockBirdData, 3);
    assert(quizQuestion.question.includes('?'), 'Quiz question should end with ?');
    assert(quizQuestion.options.length === 4, 'Quiz should have 4 options');
    assert(quizQuestion.correctAnswer, 'Quiz should have correct answer');
    console.log('✓ generateQuizQuestion test passed');

    // Test manageCheckInStatus function
    console.log('Testing manageCheckInStatus...');

    const userId = 'test-user';
    const birdId = 1;
    const initialStatus = manageCheckInStatus(userId, birdId);
    assert(initialStatus.checkIns.length === 1, 'Should have initial check-in');

    const updatedStatus = manageCheckInStatus(userId, birdId);
    assert(updatedStatus.checkIns.length === 1, 'Should not duplicate check-ins');
    console.log('✓ manageCheckInStatus test passed');

    // Test awardBadges function
    console.log('Testing awardBadges...');

    const badges1 = awardBadges({ checkIns: [] });
    assert(badges1.length === 0, 'No check-ins should mean no badges');

    const badges2 = awardBadges({ checkIns: Array(10).fill({}) });
    assert(badges2.some(b => b.type === 'explorer'), 'Should award explorer badge at 10 check-ins');

    const badges3 = awardBadges({ checkIns: Array(50).fill({}) });
    assert(badges3.some(b => b.type === 'enthusiast'), 'Should award enthusiast badge at 50 check-ins');

    const badges4 = awardBadges({ checkIns: Array(100).fill({}) });
    assert(badges4.some(b => b.type === 'expert'), 'Should award expert badge at 100 check-ins');
    console.log('✓ awardBadges test passed');

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    return false;
  }
  return true;
}

// We'll run tests after we implement the functions
setTimeout(() => {
  if (typeof generateIdentificationQuestion !== 'undefined') {
    runTests();
  }
}, 100);
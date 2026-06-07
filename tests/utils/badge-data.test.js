// Test file for badge-data.js

// Mock badge data for testing
const mockBadgeData = [
  {
    id: 'shenzhen_bay_park',
    name: '深圳湾公园',
    spotName: '深圳湾公园',
    description: '访问深圳湾公园获得此徽章',
    icon: 'binoculars',
    requirements: { spotName: '深圳湾公园' }
  },
  {
    id: 'futian_mangrove',
    name: '福田红树林',
    spotName: '福田红树林生态公园',
    description: '访问福田红树林生态公园获得此徽章',
    icon: 'leaf',
    requirements: { spotName: '福田红树林生态公园' }
  },
  {
    id: 'oct_wetland',
    name: '华侨城湿地',
    spotName: '华侨城国家湿地公园',
    description: '访问华侨城国家湿地公园获得此徽章',
    icon: 'water',
    requirements: { spotName: '华侨城国家湿地公园' }
  }
];

// Mock user check-in data for testing
const mockUserData = {
  checkIns: [
    { spotName: '深圳湾公园', date: '2023-01-01' },
    { spotName: '福田红树林生态公园', date: '2023-01-02' },
    { spotName: '华侨城国家湿地公园', date: '2023-01-03' }
  ]
};

// Simple assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Test runner
function runTests() {
  try {
    // Load the badge data module
    const badgeModule = require('../../miniprogram/utils/badge-data.js');

    // Override the default badge data with mock data for testing
    badgeModule.BADGE_DATA = mockBadgeData;

    console.log('Testing getBadgesForSpot function...');

    // Test getting badges for a specific spot
    const bayParkBadges = badgeModule.getBadgesForSpot('深圳湾公园');
    assert(bayParkBadges.length === 1, 'Should return one badge for 深圳湾公园');
    assert(bayParkBadges[0].spotName === '深圳湾公园', 'Badge should match spot name');
    console.log('✓ getBadgesForSpot test passed');

    // Test getting badges for non-existent spot
    const nonExistentBadges = badgeModule.getBadgesForSpot('Non Existent Spot');
    assert(nonExistentBadges.length === 0, 'Should return empty array for non-existent spot');
    console.log('✓ getBadgesForSpot non-existent test passed');

    console.log('Testing getAllBadgeSummaries function...');

    // Test getting all badge summaries
    const allSummaries = badgeModule.getAllBadgeSummaries();
    assert(allSummaries.length === 5, 'Should return 5 badge summaries (one for each birding spot)');
    assert(allSummaries.every(summary =>
      summary.hasOwnProperty('id') &&
      summary.hasOwnProperty('name') &&
      summary.hasOwnProperty('icon') &&
      summary.hasOwnProperty('isEarned')
    ), 'All summaries should have required properties');
    console.log('✓ getAllBadgeSummaries test passed');

    console.log('Testing getUserBadgeStatus function...');

    // Test getting user badge status
    const userStatus = badgeModule.getUserBadgeStatus(mockUserData);
    assert(Array.isArray(userStatus), 'Should return an array');
    assert(userStatus.length === 3, 'Should return 3 badges for user with 3 check-ins');
    assert(userStatus.every(badge => badge.isEarned === true), 'All badges should be earned');
    console.log('✓ getUserBadgeStatus test passed');

    console.log('Testing getUserBadgeCount function...');

    // Test getting user badge count
    const userBadgeCount = badgeModule.getUserBadgeCount(mockUserData);
    assert(typeof userBadgeCount === 'number', 'Should return a number');
    assert(userBadgeCount === 3, 'Should return 3 earned badges for user with 3 check-ins');
    console.log('✓ getUserBadgeCount test passed');

    console.log('Testing isCollectionComplete function...');

    // Test isCollectionComplete with all badges earned
    const isComplete1 = badgeModule.isCollectionComplete(mockUserData);
    assert(isComplete1 === false, 'Collection should not be complete with only 3 of 5 possible badges');

    // Create user with no check-ins
    const emptyUserData = { checkIns: [] };
    const isComplete2 = badgeModule.isCollectionComplete(emptyUserData);
    assert(isComplete2 === false, 'Collection should not be complete with no check-ins');
    console.log('✓ isCollectionComplete test passed');

    console.log('\n🎉 All tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

// Run tests
runTests();
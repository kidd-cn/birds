// Test file for badge-data.js

// Mock user check-in data for testing with real birding spot names
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
    assert(userStatus.length === 5, 'Should return 5 badges (one for each birding spot)');
    // Of the 5, 3 should be earned based on the mock data
    const earnedCount = userStatus.filter(badge => badge.isEarned).length;
    assert(earnedCount === 3, 'Should have 3 earned badges for user with 3 matching check-ins');
    console.log('✓ getUserBadgeStatus test passed');

    console.log('Testing getUserBadgeCount function...');

    // Test getting user badge count
    const userBadgeCount = badgeModule.getUserBadgeCount(mockUserData);
    assert(typeof userBadgeCount === 'number', 'Should return a number');
    assert(userBadgeCount === 3, 'Should return 3 earned badges for user with 3 matching check-ins');
    console.log('✓ getUserBadgeCount test passed');

    console.log('Testing isCollectionComplete function...');

    // Test isCollectionComplete with 3 of 5 badges earned
    const isComplete1 = badgeModule.isCollectionComplete(mockUserData);
    assert(isComplete1 === false, 'Collection should not be complete with only 3 of 5 possible badges');

    // Create user with no check-ins
    const emptyUserData = { checkIns: [] };
    const isComplete2 = badgeModule.isCollectionComplete(emptyUserData);
    assert(isComplete2 === false, 'Collection should not be complete with no check-ins');

    // Test with all spots visited
    const completeUserData = {
      checkIns: [
        { spotName: '深圳湾公园', date: '2023-01-01' },
        { spotName: '福田红树林生态公园', date: '2023-01-02' },
        { spotName: '华侨城国家湿地公园', date: '2023-01-03' },
        { spotName: '内伶仃福田国家级自然保护区', date: '2023-01-04' },
        { spotName: '仙湖植物园', date: '2023-01-05' }
      ]
    };
    const isComplete3 = badgeModule.isCollectionComplete(completeUserData);
    assert(isComplete3 === true, 'Collection should be complete with all 5 spots visited');

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
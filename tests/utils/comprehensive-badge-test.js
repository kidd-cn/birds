// Comprehensive test for badge data functionality
const badgeModule = require('../../miniprogram/utils/badge-data.js');

console.log('=== Comprehensive Badge Data Test ===\n');

// Test 1: Basic badge data structure
console.log('1. Testing badge data structure:');
console.log(`Total badges: ${badgeModule.BADGE_DATA.length}`);
badgeModule.BADGE_DATA.forEach((badge, idx) => {
  console.log(`  ${idx + 1}. ${badge.name} (${badge.id}) - Icon: ${badge.icon}`);
});
console.log('');

// Test 2: Get badges for specific spots
console.log('2. Testing getBadgesForSpot function:');
const bayParkBadges = badgeModule.getBadgesForSpot('深圳湾公园');
console.log(`Badges for 深圳湾公园: ${bayParkBadges.length}`);
if (bayParkBadges.length > 0) {
  console.log(`  - ${bayParkBadges[0].name}: ${bayParkBadges[0].description}`);
}
console.log('');

// Test 3: Get all badge summaries
console.log('3. Testing getAllBadgeSummaries function:');
const allSummaries = badgeModule.getAllBadgeSummaries();
console.log(`All badge summaries: ${allSummaries.length}`);
allSummaries.forEach((summary, idx) => {
  console.log(`  ${idx + 1}. ${summary.name} - Earned: ${summary.isEarned}`);
});
console.log('');

// Test 4: User badge status with sample data
console.log('4. Testing getUserBadgeStatus function:');
const sampleUserData = {
  checkIns: [
    { spotName: '深圳湾公园', date: '2023-01-01' },
    { spotName: '仙湖植物园', date: '2023-01-02' }
  ]
};
const userStatus = badgeModule.getUserBadgeStatus(sampleUserData);
console.log(`User badges status: ${userStatus.length}`);
userStatus.forEach(badge => {
  console.log(`  - ${badge.name}: ${badge.isEarned ? 'EARNED' : 'NOT EARNED'}`);
});
console.log('');

// Test 5: User badge count
console.log('5. Testing getUserBadgeCount function:');
const userCount = badgeModule.getUserBadgeCount(sampleUserData);
console.log(`User badge count: ${userCount}`);
console.log('');

// Test 6: Collection completion
console.log('6. Testing isCollectionComplete function:');
const isComplete = badgeModule.isCollectionComplete(sampleUserData);
console.log(`Collection complete: ${isComplete}`);

// Test with all spots
const completeUserData = {
  checkIns: [
    { spotName: '深圳湾公园', date: '2023-01-01' },
    { spotName: '福田红树林生态公园', date: '2023-01-02' },
    { spotName: '华侨城国家湿地公园', date: '2023-01-03' },
    { spotName: '内伶仃福田国家级自然保护区', date: '2023-01-04' },
    { spotName: '仙湖植物园', date: '2023-01-05' }
  ]
};
const isCompleteFull = badgeModule.isCollectionComplete(completeUserData);
console.log(`Collection complete with all spots: ${isCompleteFull}`);
console.log('');

console.log('=== All tests completed successfully! ===');
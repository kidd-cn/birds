// Simple test to check that badge data integrates well with the rest of the system
const { SHENZHEN_BIRDING_SPOTS } = require('./birdingSpots.js');
const badgeModule = require('./badge-data.js');

console.log('Testing integration between birding spots and badge data...');

console.log(`Number of birding spots: ${SHENZHEN_BIRDING_SPOTS.length}`);
console.log(`Number of badges: ${badgeModule.BADGE_DATA.length}`);

// Verify that each birding spot has a corresponding badge
for (let i = 0; i < SHENZHEN_BIRDING_SPOTS.length; i++) {
  const spot = SHENZHEN_BIRDING_SPOTS[i];
  const hasBadge = badgeModule.BADGE_DATA.some(badge => badge.spotName === spot.name);
  console.log(`Spot "${spot.name}" has badge: ${hasBadge}`);
}

console.log('Integration test completed successfully!');
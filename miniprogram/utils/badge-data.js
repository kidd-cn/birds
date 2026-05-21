/**
 * Badge data management utilities for the bird-watching mini-program
 */

const { SHENZHEN_BIRDING_SPOTS } = require('./birdingSpots.js');

// Define icons mapping for different habitats
const HABITAT_ICONS = {
  '滨海湿地': 'waves',
  '红树林湿地': 'tree',
  '淡水湿地': 'water',
  '红树林生态系统': 'forest',
  '山林湿地': 'mountain'
};

// Dynamically generate badge data from birding spots
const BADGE_DATA = SHENZHEN_BIRDING_SPOTS.map((spot, index) => {
  // Create a unique ID from the spot name by converting Chinese to pinyin or transliteration
  // Since direct Chinese to Latin conversion isn't available, we'll use index-based IDs for Chinese names
  const spotId = spot.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
  const cleanSpotId = spotId || `spot_${index}`;

  // Get icon based on habitat
  const icon = HABITAT_ICONS[spot.habitat] || 'star';

  return {
    id: `${cleanSpotId}_badge`,
    name: `${spot.name}探索者`,
    spotName: spot.name,
    description: `访问${spot.name}获得此徽章`,
    icon: icon,
    requirements: {
      spotName: spot.name,
      visitCount: 1
    }
  };
});

/**
 * Gets badges for a specific birding spot
 * @param {string} spotName - Name of the birding spot
 * @returns {Array} Array of badges associated with the spot
 */
function getBadgesForSpot(spotName) {
  if (!spotName) {
    return [];
  }

  return BADGE_DATA.filter(badge =>
    badge.requirements.spotName === spotName
  );
}

/**
 * Gets all badge summaries with user's earned status
 * @returns {Array} Array of badge summary objects
 */
function getAllBadgeSummaries() {
  // Return basic badge info without user-specific data
  // This function could be extended to take user data to determine isEarned
  return BADGE_DATA.map(badge => ({
    id: badge.id,
    name: badge.name,
    icon: badge.icon,
    isEarned: false // Default to false without user data
  }));
}

/**
 * Gets user's badge status based on their check-in data
 * @param {Object} userData - User's check-in data containing checkIns array
 * @returns {Array} Array of badges with earned status
 */
function getUserBadgeStatus(userData) {
  if (!userData || !Array.isArray(userData.checkIns)) {
    // Return all badges as unearned if no user data
    return BADGE_DATA.map(badge => ({
      ...badge,
      isEarned: false,
      earnedDate: null
    }));
  }

  // Get visited spot names from user's check-ins
  const visitedSpots = new Set();
  userData.checkIns.forEach(checkIn => {
    if (checkIn.spotName) {
      visitedSpots.add(checkIn.spotName);
    }
  });

  // Determine which badges the user has earned
  return BADGE_DATA.map(badge => {
    const isEarned = visitedSpots.has(badge.requirements.spotName);

    return {
      ...badge,
      isEarned: isEarned,
      earnedDate: isEarned ? new Date() : null
    };
  });
}

/**
 * Gets the count of badges earned by the user
 * @param {Object} userData - User's check-in data containing checkIns array
 * @returns {number} Count of badges earned
 */
function getUserBadgeCount(userData) {
  const userBadges = getUserBadgeStatus(userData);
  return userBadges.filter(badge => badge.isEarned).length;
}

/**
 * Checks if the user has collected all available badges
 * @param {Object} userData - User's check-in data containing checkIns array
 * @returns {boolean} Whether all badges have been earned
 */
function isCollectionComplete(userData) {
  const totalBadges = BADGE_DATA.length;
  const earnedCount = getUserBadgeCount(userData);
  return earnedCount === totalBadges;
}

module.exports = {
  BADGE_DATA,
  getBadgesForSpot,
  getAllBadgeSummaries,
  getUserBadgeStatus,
  getUserBadgeCount,
  isCollectionComplete
};
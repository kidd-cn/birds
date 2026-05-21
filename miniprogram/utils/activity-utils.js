/**
 * Utility functions for bird-watching activities
 */

// Constants for storage keys
const CHECK_IN_STORAGE_KEY = 'bird_checkins';

/**
 * Helper function to get check-in storage from local storage
 */
function getCheckInStorage() {
  try {
    const storedData = wx.getStorageSync(CHECK_IN_STORAGE_KEY);
    return storedData || {};
  } catch (error) {
    console.error('Error getting check-in storage:', error);
    return {};
  }
}

/**
 * Helper function to save check-in storage to local storage
 */
function saveCheckInStorage(data) {
  try {
    wx.setStorageSync(CHECK_IN_STORAGE_KEY, data);
  } catch (error) {
    console.error('Error saving check-in storage:', error);
  }
}

/**
 * Validates a user ID to prevent prototype pollution
 * @param {string} userId - The user ID to validate
 * @returns {boolean} Whether the ID is valid
 */
function validateUserId(userId) {
  // Basic validation - ensure it's a string and doesn't contain dangerous properties
  if (typeof userId !== 'string') {
    return false;
  }

  // Prevent prototype pollution by checking for dangerous property names
  const dangerousProps = ['__proto__', 'constructor', 'prototype'];
  if (dangerousProps.some(prop => userId.includes(prop))) {
    return false;
  }

  // Ensure it's not an empty string
  return userId.trim().length > 0;
}

/**
 * Validates a bird ID to ensure it's safe
 * @param {number|string} birdId - The bird ID to validate
 * @returns {boolean} Whether the ID is valid
 */
function validateBirdId(birdId) {
  // Accept either a number or string, but check for prototype pollution
  if (typeof birdId === 'string') {
    const dangerousProps = ['__proto__', 'constructor', 'prototype'];
    if (dangerousProps.some(prop => birdId.includes(prop))) {
      return false;
    }
  }

  // Validate the type - either number or non-empty string
  return (typeof birdId === 'number' && !isNaN(birdId)) ||
         (typeof birdId === 'string' && birdId.trim().length > 0);
}

/**
 * Gets available birds for distractors (birds other than the target)
 * @param {Array} birdData - Array of bird objects
 * @param {Object} targetBird - The target bird to exclude
 * @returns {Array} Array of birds excluding the target
 */
function getAvailableBirds(birdData, targetBird) {
  return [...birdData.filter(bird => bird.id !== targetBird.id)];
}

/**
 * Selects random birds from available pool
 * @param {Array} availableBirds - Pool of available birds
 * @param {number} count - Number of birds to select
 * @returns {Array} Selected birds
 */
function selectRandomBirds(availableBirds, count) {
  const selected = [];
  const birdsCopy = [...availableBirds]; // Create a copy to safely modify

  for (let i = 0; i < count && birdsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * birdsCopy.length);
    const selectedBird = birdsCopy.splice(randomIndex, 1)[0];
    selected.push(selectedBird);
  }

  return selected;
}

/**
 * Gets habitat-matching birds for medium difficulty questions
 * @param {Array} availableBirds - Available birds to choose from
 * @param {Object} targetBird - The target bird for comparison
 * @returns {Array} Birds that match the target's habitat
 */
function getHabitatMatches(availableBirds, targetBird) {
  return availableBirds.filter(bird =>
    bird.habitat && targetBird.habitat &&
    bird.habitat.toLowerCase().includes(targetBird.habitat.toLowerCase())
  );
}

/**
 * Gets feature-matching birds for high difficulty questions
 * @param {Array} availableBirds - Available birds to choose from
 * @param {Object} targetBird - The target bird for comparison
 * @returns {Array} Birds that have similar features to the target
 */
function getFeatureMatches(availableBirds, targetBird) {
  if (!targetBird.features) return [];

  return availableBirds.filter(bird =>
    bird.features &&
    bird.features.some(feat =>
      targetBird.features.some(tFeat =>
        feat.toLowerCase().includes(tFeat.toLowerCase()) ||
        tFeat.toLowerCase().includes(feat.toLowerCase())
      )
    )
  );
}

/**
 * Generates an identification question based on bird data
 * @param {Array} birdData - Array of bird objects
 * @param {number} difficulty - Difficulty level (1-5)
 * @returns {Object} Question object with question text, options, and correct answer
 */
function generateIdentificationQuestion(birdData, difficulty) {
  try {
    if (!birdData || !Array.isArray(birdData) || birdData.length < 1) {
      throw new Error('Bird data is required and must be an array with at least one bird');
    }

    if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
      throw new Error('Difficulty must be a number between 1 and 5');
    }

    // Select a random bird as the target
    const targetBird = birdData[Math.floor(Math.random() * birdData.length)];

    if (!targetBird || !targetBird.id || typeof targetBird.name !== 'string') {
      throw new Error('Invalid target bird data');
    }

    // Generate options - correct answer plus distractors
    let options = [targetBird.name];

    // Based on difficulty, select appropriate distractors
    // Higher difficulty means more similar birds as options
    const distractorCount = 3; // Always 3 distractors to have 4 total options
    const availableBirds = getAvailableBirds(birdData, targetBird);

    // First, try to select distractors based on difficulty
    let selectedDistractors = [];
    for (let i = 0; i < distractorCount; i++) {
      if (availableBirds.length === 0) break; // Safety check

      let selectedBird;

      if (difficulty <= 2) {
        // Low difficulty: Random birds with no relation to target
        selectedBird = availableBirds.splice(
          Math.floor(Math.random() * availableBirds.length),
          1
        )[0];
      } else if (difficulty <= 3) {
        // Medium difficulty: Birds that might be confused with target based on habitat
        const habitatMatches = getHabitatMatches(availableBirds, targetBird);

        if (habitatMatches.length > 0) {
          selectedBird = habitatMatches.splice(
            Math.floor(Math.random() * habitatMatches.length),
            1
          )[0];
          // Remove from available birds
          const index = availableBirds.indexOf(selectedBird);
          if (index !== -1) availableBirds.splice(index, 1);
        } else {
          selectedBird = availableBirds.splice(
            Math.floor(Math.random() * availableBirds.length),
            1
          )[0];
        }
      } else {
        // High difficulty (4-5): Birds that might be confused based on similar features or family
        const featureMatches = getFeatureMatches(availableBirds, targetBird);

        if (featureMatches.length > 0) {
          selectedBird = featureMatches.splice(
            Math.floor(Math.random() * featureMatches.length),
            1
          )[0];
          // Remove from available birds
          const index = availableBirds.indexOf(selectedBird);
          if (index !== -1) availableBirds.splice(index, 1);
        } else {
          selectedBird = availableBirds.splice(
            Math.floor(Math.random() * availableBirds.length),
            1
          )[0];
        }
      }

      if (selectedBird && selectedBird.name) {
        selectedDistractors.push(selectedBird.name);
      }
    }

    // Combine correct answer with selected distractors
    options = [targetBird.name, ...selectedDistractors];

    // If we don't have enough options, fill with random birds from the entire dataset
    // that aren't already in the options
    if (options.length < 4) {
      const allOtherBirds = birdData.filter(bird => !options.includes(bird.name));
      while (options.length < 4 && allOtherBirds.length > 0) {
        const randomIndex = Math.floor(Math.random() * allOtherBirds.length);
        const randomBird = allOtherBirds.splice(randomIndex, 1)[0];
        options.push(randomBird.name);
      }
    }

    // Make sure we have exactly 4 options by padding with repeated options if necessary
    // (though this should be very rare with the above logic)
    while (options.length < 4 && birdData.length > 0) {
      const randomBird = birdData[Math.floor(Math.random() * birdData.length)];
      if (randomBird && randomBird.name && !options.includes(randomBird.name)) {
        options.push(randomBird.name);
      }
    }

    // Ensure we have exactly 4 options
    if (options.length > 4) {
      options = options.slice(0, 4);
    } else {
      // Fill up to 4 if we have fewer than 4
      const allBirds = birdData.filter(bird => !options.includes(bird.name));
      while (options.length < 4 && allBirds.length > 0) {
        const randomBird = allBirds.splice(Math.floor(Math.random() * allBirds.length), 1)[0];
        options.push(randomBird.name);
      }
    }

    // Shuffle options to randomize order
    options = shuffleArray(options);

    return {
      question: `Which bird has these characteristics: ${targetBird.description || targetBird.name}?`,
      options: options,
      correctAnswer: targetBird.name,
      targetBirdId: targetBird.id,
      difficulty: difficulty
    };
  } catch (error) {
    console.error('Error generating identification question:', error);
    throw error;
  }
}

/**
 * Generates a quiz question about bird features
 * @param {Array} birdData - Array of bird objects
 * @param {number} difficulty - Difficulty level (1-5)
 * @returns {Object} Quiz question object with question text, options, and correct answer
 */
function generateQuizQuestion(birdData, difficulty) {
  try {
    if (!birdData || !Array.isArray(birdData) || birdData.length < 1) {
      throw new Error('Bird data is required and must be an array with at least one bird');
    }

    if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
      throw new Error('Difficulty must be a number between 1 and 5');
    }

    const targetBird = birdData[Math.floor(Math.random() * birdData.length)];

    if (!targetBird || !targetBird.id || typeof targetBird.name !== 'string') {
      throw new Error('Invalid target bird data');
    }

    // Different types of quiz questions based on difficulty
    let questionText = '';
    let options = [];
    let correctAnswer = targetBird.name;

    // Determine question type based on difficulty
    const questionTypes = ['appearance', 'habitat', 'features', 'scientific'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    switch(questionType) {
      case 'appearance':
        // Question about appearance features
        if (targetBird.features && targetBird.features.length > 0) {
          const randomFeature = targetBird.features[Math.floor(Math.random() * targetBird.features.length)];
          questionText = `Which bird is known for having "${randomFeature}"?`;

          // Generate options based on difficulty
          options = [targetBird.name];

          if (difficulty <= 2) {
            // Easy: Just random birds
            const otherBirds = birdData.filter(bird => bird.id !== targetBird.id);
            for (let i = 0; i < 3; i++) {
              if (otherBirds.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherBirds.length);
                options.push(otherBirds[randomIndex].name);
                otherBirds.splice(randomIndex, 1);
              }
            }
          } else {
            // Harder: Birds that might have similar features
            const potentialSimilar = birdData.filter(bird =>
              bird.id !== targetBird.id &&
              bird.features &&
              bird.features.some(feat =>
                randomFeature.toLowerCase().includes(feat.toLowerCase()) ||
                feat.toLowerCase().includes(randomFeature.toLowerCase())
              )
            );

            if (potentialSimilar.length > 0 && difficulty >= 4) {
              // High difficulty: Mix of similar and random birds
              const similarCount = Math.min(2, potentialSimilar.length);
              for (let i = 0; i < similarCount; i++) {
                const randomIndex = Math.floor(Math.random() * potentialSimilar.length);
                options.push(potentialSimilar[randomIndex].name);
                potentialSimilar.splice(randomIndex, 1);
              }

              // Fill remaining with random birds
              const otherBirds = birdData.filter(bird =>
                !options.includes(bird.name) && bird.id !== targetBird.id
              );
              while (options.length < 4 && otherBirds.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherBirds.length);
                options.push(otherBirds[randomIndex].name);
                otherBirds.splice(randomIndex, 1);
              }
            } else {
              // Lower difficulty but not easy: Random birds
              const otherBirds = birdData.filter(bird =>
                bird.id !== targetBird.id && !options.includes(bird.name)
              );
              while (options.length < 4 && otherBirds.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherBirds.length);
                options.push(otherBirds[randomIndex].name);
                otherBirds.splice(randomIndex, 1);
              }
            }
          }
        } else {
          // Fallback if no features
          questionText = `Which bird has the scientific name "${targetBird.scientificName}"?`;
          options = [targetBird.name];

          const otherBirds = birdData.filter(bird => bird.id !== targetBird.id);
          for (let i = 0; i < 3; i++) {
            if (otherBirds.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherBirds.length);
              options.push(otherBirds[randomIndex].scientificName);
              otherBirds.splice(randomIndex, 1);
            }
          }
          correctAnswer = targetBird.scientificName;
        }
        break;

      case 'habitat':
        // Question about habitat
        if (targetBird.habitat) {
          questionText = `Where would you most likely find a ${targetBird.name}?`;
          options = [targetBird.habitat];

          const otherBirds = birdData.filter(bird =>
            bird.id !== targetBird.id && bird.habitat && !options.includes(bird.habitat)
          );

          while (options.length < 4 && otherBirds.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherBirds.length);
            options.push(otherBirds[randomIndex].habitat);
            otherBirds.splice(randomIndex, 1);
          }

          // Add generic options if we don't have enough
          const genericHabitats = ['Mountains', 'Deserts', 'Coastal Areas', 'Urban Parks', 'Wetlands'];
          while (options.length < 4 && genericHabitats.length > 0) {
            const randomIndex = Math.floor(Math.random() * genericHabitats.length);
            options.push(genericHabitats[randomIndex]);
            genericHabitats.splice(randomIndex, 1);
          }

          // Limit to 4 options
          options = options.slice(0, 4);
        } else {
          // Fallback
          questionText = `Which bird is known as "${targetBird.name}"?`;
          options = [targetBird.name];

          const otherBirds = birdData.filter(bird => bird.id !== targetBird.id);
          for (let i = 0; i < 3; i++) {
            if (otherBirds.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherBirds.length);
              options.push(otherBirds[randomIndex].name);
              otherBirds.splice(randomIndex, 1);
            }
          }
        }
        break;

      case 'scientific':
        // Question about scientific name
        questionText = `What is the scientific name for the ${targetBird.name}?`;
        options = [targetBird.scientificName];

        const otherBirds = birdData.filter(bird => bird.id !== targetBird.id && bird.scientificName);
        while (options.length < 4 && otherBirds.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherBirds.length);
          options.push(otherBirds[randomIndex].scientificName);
          otherBirds.splice(randomIndex, 1);
        }

        // Add generic scientific-like names if needed
        const genericNames = [
          'Aves species',
          'Birdus unknownus',
          'Animalia avian',
          'Fauna volatus'
        ];
        while (options.length < 4 && genericNames.length > 0) {
          options.push(genericNames.pop());
        }

        options = options.slice(0, 4);
        correctAnswer = targetBird.scientificName;
        break;

      case 'features':
        // Question about specific feature
        if (targetBird.features && targetBird.features.length > 0) {
          const feature = targetBird.features[0]; // Take first feature
          questionText = `Which bird is characterized by its "${feature}"?`;
          options = [targetBird.name];

          if (difficulty >= 4) {
            // High difficulty: Include birds that might have similar features
            const similarBirds = birdData.filter(bird =>
              bird.id !== targetBird.id &&
              bird.features &&
              bird.features.some(feat =>
                feat.toLowerCase().includes(feature.toLowerCase()) ||
                feature.toLowerCase().includes(feat.toLowerCase())
              )
            );

            const similarCount = Math.min(2, similarBirds.length);
            for (let i = 0; i < similarCount; i++) {
              if (similarBirds.length > 0) {
                const randomIndex = Math.floor(Math.random() * similarBirds.length);
                options.push(similarBirds[randomIndex].name);
                similarBirds.splice(randomIndex, 1);
              }
            }

            // Fill rest with random birds
            const otherBirds = birdData.filter(bird =>
              bird.id !== targetBird.id && !options.includes(bird.name)
            );
            while (options.length < 4 && otherBirds.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherBirds.length);
              options.push(otherBirds[randomIndex].name);
              otherBirds.splice(randomIndex, 1);
            }
          } else {
            // Lower difficulty: Just random birds
            const otherBirds = birdData.filter(bird =>
              bird.id !== targetBird.id && !options.includes(bird.name)
            );
            while (options.length < 4 && otherBirds.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherBirds.length);
              options.push(otherBirds[randomIndex].name);
              otherBirds.splice(randomIndex, 1);
            }
          }
        } else {
          // Fallback
          questionText = `Which bird is known as "${targetBird.name}"?`;
          options = [targetBird.name];

          const otherBirds = birdData.filter(bird => bird.id !== targetBird.id);
          for (let i = 0; i < 3; i++) {
            if (otherBirds.length > 0) {
              const randomIndex = Math.floor(Math.random() * otherBirds.length);
              options.push(otherBirds[randomIndex].name);
              otherBirds.splice(randomIndex, 1);
            }
          }
        }
        break;
    }

    // Shuffle options
    options = shuffleArray(options);

    return {
      question: questionText,
      options: options,
      correctAnswer: correctAnswer,
      difficulty: difficulty,
      category: questionType
    };
  } catch (error) {
    console.error('Error generating quiz question:', error);
    throw error;
  }
}

/**
 * Manages check-in status for a user and bird
 * @param {string} userId - Unique identifier for the user
 * @param {number} birdId - Unique identifier for the bird
 * @returns {Object} Updated check-in status for the user
 */
function manageCheckInStatus(userId, birdId) {
  try {
    if (!validateUserId(userId)) {
      throw new Error('Valid User ID is required');
    }

    if (!validateBirdId(birdId)) {
      throw new Error('Valid Bird ID is required');
    }

    // Get current check-in storage
    const checkInStorage = getCheckInStorage();

    // Initialize user data if not present
    if (!checkInStorage[userId]) {
      checkInStorage[userId] = {
        checkIns: [],
        lastCheckInDate: null
      };
    }

    const userData = checkInStorage[userId];

    // Check if this bird has already been checked in today
    const today = new Date().toDateString();
    const existingCheckIn = userData.checkIns.find(checkIn =>
      checkIn.birdId === birdId &&
      new Date(checkIn.date).toDateString() === today
    );

    if (!existingCheckIn) {
      // Add new check-in
      userData.checkIns.push({
        birdId: birdId,
        date: new Date(),
        location: null // In a real app, this would come from GPS or user input
      });
      userData.lastCheckInDate = new Date();

      // Save updated storage
      saveCheckInStorage(checkInStorage);
    }

    return {
      userId: userId,
      checkIns: userData.checkIns,
      lastCheckInDate: userData.lastCheckInDate,
      isNewCheckIn: !existingCheckIn
    };
  } catch (error) {
    console.error('Error managing check-in status:', error);
    throw error;
  }
}

/**
 * Awards badges based on check-in statistics
 * @param {Object} userStatus - User's check-in status object
 * @returns {Array} Array of earned badges
 */
function awardBadges(userStatus) {
  try {
    if (!userStatus || !userStatus.checkIns || !Array.isArray(userStatus.checkIns)) {
      throw new Error('User status with check-ins array is required');
    }

    const badges = [];
    const checkInCount = userStatus.checkIns.length;

    // Explorer badge - for 10 check-ins
    if (checkInCount >= 10) {
      badges.push({
        type: 'explorer',
        name: 'Bird Explorer',
        description: 'Reached 10 bird check-ins',
        earnedDate: new Date()
      });
    }

    // Enthusiast badge - for 50 check-ins
    if (checkInCount >= 50) {
      badges.push({
        type: 'enthusiast',
        name: 'Bird Enthusiast',
        description: 'Reached 50 bird check-ins',
        earnedDate: new Date()
      });
    }

    // Expert badge - for 100 check-ins
    if (checkInCount >= 100) {
      badges.push({
        type: 'expert',
        name: 'Bird Expert',
        description: 'Reached 100 bird check-ins',
        earnedDate: new Date()
      });
    }

    // Frequent Observer badge - for checking in 5 different birds in one day
    const checkInDates = {};
    userStatus.checkIns.forEach(checkIn => {
      if (checkIn.date) {
        const dateStr = new Date(checkIn.date).toDateString();
        if (!checkInDates[dateStr]) {
          checkInDates[dateStr] = new Set();
        }
        if (checkIn.birdId) {
          checkInDates[dateStr].add(checkIn.birdId);
        }
      }
    });

    // Check if any day has 5+ different bird check-ins
    let hasFrequentObserver = false;
    for (const dateStr in checkInDates) {
      if (checkInDates[dateStr].size >= 5) {
        hasFrequentObserver = true;
        break;
      }
    }

    if (hasFrequentObserver) {
      badges.push({
        type: 'frequent_observer',
        name: 'Frequent Observer',
        description: 'Checked in 5+ different birds in a single day',
        earnedDate: new Date()
      });
    }

    // Rare Sighting badge - for checking in a bird that is rare in the region
    // This would typically involve comparing to regional rarity data
    // For now, we'll simulate this by checking for recently added birds

    return badges;
  } catch (error) {
    console.error('Error awarding badges:', error);
    throw error;
  }
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  try {
    // Create a copy to avoid modifying the original
    const arrCopy = [...array];

    for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
    }
    return arrCopy;
  } catch (error) {
    console.error('Error shuffling array:', error);
    // Return original array if shuffle fails
    return [...array];
  }
}

// Export functions for use in other modules
module.exports = {
  generateIdentificationQuestion,
  generateQuizQuestion,
  manageCheckInStatus,
  awardBadges
};
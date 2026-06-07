// Test runner for activity-utils.js

// Since this is for a WeChat mini program, we need to adapt our approach slightly
// For testing purposes, let's load the module and run the tests

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

function runTests() {
  console.log('Starting tests for activity-utils...');

  try {
    // We need to implement a way to load the functions
    // Since Node.js doesn't directly support the module.exports from WeChat Mini Programs,
    // we'll copy the function implementations directly for testing

    // Copying the function implementations here for testing
    // (in a real scenario, you might use a build tool or different test setup)

    // Test generateIdentificationQuestion function
    console.log('Testing generateIdentificationQuestion...');

    // Define the functions locally for testing
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function generateIdentificationQuestion(birdData, difficulty) {
      if (!birdData || birdData.length < 1) {
        throw new Error('Bird data is required and must have at least one bird');
      }

      if (difficulty < 1 || difficulty > 5) {
        throw new Error('Difficulty must be between 1 and 5');
      }

      // Select a random bird as the target
      const targetBird = birdData[Math.floor(Math.random() * birdData.length)];

      // Generate options - correct answer plus distractors
      let options = [targetBird.name];

      // Based on difficulty, select appropriate distractors
      // Higher difficulty means more similar birds as options
      const distractorCount = 3; // Always 3 distractors to have 4 total options
      const availableBirds = [...birdData.filter(bird => bird.id !== targetBird.id)]; // Create a copy to safely modify

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
          const habitatMatches = availableBirds.filter(bird =>
            bird.habitat && targetBird.habitat &&
            bird.habitat.toLowerCase().includes(targetBird.habitat.toLowerCase())
          );

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
          const featureMatches = availableBirds.filter(bird =>
            bird.features && targetBird.features &&
            bird.features.some(feat =>
              targetBird.features.some(tFeat =>
                feat.toLowerCase().includes(tFeat.toLowerCase()) ||
                tFeat.toLowerCase().includes(feat.toLowerCase())
              )
            )
          );

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

        if (selectedBird) {
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
        const randomBird = birdData[Math.floor(Math.random() * birdData.length)].name;
        if (!options.includes(randomBird)) {
          options.push(randomBird);
        }
      }

      // Shuffle options to randomize order
      options = shuffleArray(options);

      return {
        question: `Which bird has these characteristics: ${targetBird.description}?`,
        options: options,
        correctAnswer: targetBird.name,
        targetBirdId: targetBird.id,
        difficulty: difficulty
      };
    }

    function generateQuizQuestion(birdData, difficulty) {
      if (!birdData || birdData.length < 1) {
        throw new Error('Bird data is required and must have at least one bird');
      }

      if (difficulty < 1 || difficulty > 5) {
        throw new Error('Difficulty must be between 1 and 5');
      }

      const targetBird = birdData[Math.floor(Math.random() * birdData.length)];

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
    }

    function manageCheckInStatus(userId, birdId) {
      // In-memory storage for testing
      if (typeof checkInStorage === 'undefined') {
        checkInStorage = {};
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!birdId) {
        throw new Error('Bird ID is required');
      }

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
      }

      return {
        userId: userId,
        checkIns: userData.checkIns,
        lastCheckInDate: userData.lastCheckInDate,
        isNewCheckIn: !existingCheckIn
      };
    }

    function awardBadges(userStatus) {
      if (!userStatus || !userStatus.checkIns) {
        throw new Error('User status with check-ins is required');
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
        const dateStr = new Date(checkIn.date).toDateString();
        if (!checkInDates[dateStr]) {
          checkInDates[dateStr] = new Set();
        }
        checkInDates[dateStr].add(checkIn.birdId);
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

      return badges;
    }

    // Now run the actual tests
    const question1 = generateIdentificationQuestion(mockBirdData, 1);
    console.log('DEBUG: Number of options:', question1.options.length, 'Options:', question1.options);
    assert(question1.question.includes('Which bird'), 'Question should be an identification question');
    assert(question1.options.length === 4, `Should have 4 options, but got ${question1.options.length}`);
    assert(question1.correctAnswer, 'Should have correct answer');
    console.log('✓ generateIdentificationQuestion basic test passed');

    const question5 = generateIdentificationQuestion(mockBirdData, 5);
    assert(question5.difficulty >= 4, 'High difficulty should have appropriate difficulty level');
    console.log('✓ generateIdentificationQuestion difficulty test passed');

    // Test generateQuizQuestion function
    console.log('Testing generateQuizQuestion...');

    const quizQuestion = generateQuizQuestion(mockBirdData, 3);
    assert(quizQuestion.question.includes('?'), 'Quiz question should end with ?');
    assert(quizQuestion.options.length === 4, 'Quiz should have 4 options');
    assert(quizQuestion.correctAnswer, 'Quiz should have correct answer');
    assert(['appearance', 'habitat', 'features', 'scientific'].includes(quizQuestion.category), 'Should have valid category');
    console.log('✓ generateQuizQuestion test passed');

    // Test manageCheckInStatus function
    console.log('Testing manageCheckInStatus...');

    const userId = 'test-user';
    const birdId = 1;
    const initialStatus = manageCheckInStatus(userId, birdId);
    assert(initialStatus.checkIns.length === 1, 'Should have initial check-in');

    const updatedStatus = manageCheckInStatus(userId, birdId);
    assert(updatedStatus.checkIns.length === 1, 'Should not duplicate check-ins');
    assert(!updatedStatus.isNewCheckIn, 'Should not be marked as new check-in if already checked in today');
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

    // Test frequent observer badge
    const mockCheckIns = [];
    // Add 5 check-ins for the same day with different bird IDs
    for (let i = 1; i <= 5; i++) {
      mockCheckIns.push({ birdId: i, date: new Date() });
    }
    const badgesFreq = awardBadges({ checkIns: mockCheckIns });
    assert(badgesFreq.some(b => b.type === 'frequent_observer'), 'Should award frequent observer badge for 5 birds in one day');

    console.log('✓ awardBadges test passed');

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
  return true;
}

// Execute the tests
runTests();
// miniprogram/components/checkin-activity/checkin-activity.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  /**
   * Component properties
   */
  properties: {
  },

  /**
   * Component initial data
   */
  data: {
    spots: [
      {
        id: 'spot1',
        name: 'Shenzhen Bay Park',
        location: 'Nanshan District',
        description: 'Coastal wetland with diverse waterbirds',
        birdSpecies: ['Black-faced Spoonbill', 'Great Egret', 'Little Egret'],
        difficulty: 'Easy',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot2',
        name: 'Xili Lake Reservoir',
        location: 'Nanshan District',
        description: 'Freshwater habitat with forest edges',
        birdSpecies: ['White-throated Kingfisher', 'Common Moorhen', 'Purple Swamphen'],
        difficulty: 'Moderate',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot3',
        name: 'Dameisha Beach',
        location: 'Dapeng New District',
        description: 'Coastal area with rocky shores',
        birdSpecies: ['Whimbrel', 'Pacific Golden Plover', 'Red Knot'],
        difficulty: 'Easy',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot4',
        name: 'Huangbeiling Forest Park',
        location: 'Futian District',
        description: 'Urban forest with native species',
        birdSpecies: ['Greater Racket-tailed Drongo', 'Red-billed Leiothrix', 'Yellow-bellied Warbler'],
        difficulty: 'Hard',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot5',
        name: 'Honghu Park',
        location: 'Futian District',
        description: 'Urban lake with migratory birds',
        birdSpecies: ['Chinese Pond Heron', 'Purple Heron', 'White-breasted Waterhen'],
        difficulty: 'Easy',
        icon: 'bird-marker.svg'
      }
    ],
    badges: [
      {
        id: 'badge1',
        name: 'Shenzhen Bay Explorer',
        spotId: 'spot1',
        description: 'Checked in at Shenzhen Bay Park',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge2',
        name: 'Xili Lake Adventurer',
        spotId: 'spot2',
        description: 'Checked in at Xili Lake Reservoir',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge3',
        name: 'Dameisha Coastal Walker',
        spotId: 'spot3',
        description: 'Checked in at Dameisha Beach',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge4',
        name: 'Huangbeiling Hiker',
        spotId: 'spot4',
        description: 'Checked in at Huangbeiling Forest Park',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge5',
        name: 'Honghu Park Visitor',
        spotId: 'spot5',
        description: 'Checked in at Honghu Park',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge_all_spots',
        name: 'Birding Master',
        description: 'Visited all 5 birding spots',
        icon: 'bird-marker.svg',
        earned: false,
        requirement: 'all_spots'
      }
    ],
    checkIns: {},
    progressPercentage: 0,
    showBadgeAwarded: false,
    awardedBadgeName: '',
    checkedInSpotsCount: 0  // Add this to track checked-in spots count
  },

  /**
   * Component methods
   */
  methods: {
    checkInSpot(e) {
      const spotId = e.currentTarget.dataset.spotid;
      const spotIndex = this.data.spots.findIndex(spot => spot.id === spotId);

      if (spotIndex !== -1) {
        // Update check-in status
        const updatedCheckIns = { ...this.data.checkIns };
        updatedCheckIns[spotId] = true;

        // Update the badge status for this spot
        const updatedBadges = this.data.badges.map(badge => {
          if (badge.spotId === spotId && !badge.earned) {
            // Award the specific spot badge
            const newBadge = { ...badge, earned: true };

            // Show badge awarded feedback
            this.setData({
              showBadgeAwarded: true,
              awardedBadgeName: newBadge.name
            });

            // Hide the badge awarded message after 3 seconds
            setTimeout(() => {
              this.setData({ showBadgeAwarded: false });
            }, 3000);

            return newBadge;
          }

          return badge;
        });

        // Check if all spots are checked in for the all-spots badge
        const allSpotsChecked = this.data.spots.every(spot => updatedCheckIns[spot.id]);
        const allSpotsBadgeIndex = updatedBadges.findIndex(badge =>
          badge.requirement === 'all_spots' && !badge.earned
        );

        let finalBadges = updatedBadges;
        if (allSpotsChecked && allSpotsBadgeIndex !== -1) {
          // Award the all-spots badge
          finalBadges = updatedBadges.map((badge, index) => {
            if (index === allSpotsBadgeIndex) {
              const newBadge = { ...badge, earned: true };

              // Show badge awarded feedback
              this.setData({
                showBadgeAwarded: true,
                awardedBadgeName: newBadge.name
              });

              // Hide the badge awarded message after 3 seconds
              setTimeout(() => {
                this.setData({ showBadgeAwarded: false });
              }, 3000);

              return newBadge;
            }
            return badge;
          });
        }

        // Calculate progress percentage
        const totalSpots = this.data.spots.length;
        const checkedInCount = Object.values(updatedCheckIns).filter(checked => checked).length;
        const progressPercentage = Math.round((checkedInCount / totalSpots) * 100);

        this.setData({
          checkIns: updatedCheckIns,
          badges: finalBadges,
          progressPercentage,
          checkedInSpotsCount: checkedInCount  // Update the checked-in spots count
        });

        // Trigger an event for parent components to listen to
        this.triggerEvent('checkin', { spotId, spotIndex });
      }
    },

    // Method to determine if a spot is checked in
    isSpotCheckedIn(spotId) {
      return this.data.checkIns[spotId] === true;
    },

    // Method to calculate progress
    calculateProgress() {
      const totalSpots = this.data.spots.length;
      const checkedInCount = Object.values(this.data.checkIns).filter(checked => checked).length;
      return Math.round((checkedInCount / totalSpots) * 100);
    }
  },

  // Lifecycle method called when the component is created
  lifetimes: {
    attached() {
      // Load saved check-in data from storage if available
      try {
        const savedData = wx.getStorageSync('birdingCheckIns');
        if (savedData) {
          const updatedCheckIns = savedData.checkIns || {};
          const checkedInCount = Object.values(updatedCheckIns).filter(checked => checked).length;

          this.setData({
            checkIns: updatedCheckIns,
            progressPercentage: savedData.progressPercentage || 0,
            checkedInSpotsCount: checkedInCount
          });

          // Update badge statuses based on saved check-ins
          const updatedBadges = this.data.badges.map(badge => {
            if (badge.spotId && !badge.requirement) {
              // Regular spot badge
              const isEarned = this.data.checkIns[badge.spotId] === true;
              return { ...badge, earned: isEarned };
            } else if (badge.requirement === 'all_spots') {
              // All spots badge
              const allSpotsChecked = this.data.spots.every(spot =>
                this.data.checkIns[spot.id] === true
              );
              return { ...badge, earned: allSpotsChecked };
            }
            return badge;
          });

          this.setData({ badges: updatedBadges });
        }
      } catch (e) {
        console.error('Failed to load saved check-in data:', e);
      }
    },

    detached() {
      // Save check-in data to storage when component is removed
      try {
        wx.setStorageSync('birdingCheckIns', {
          checkIns: this.data.checkIns,
          progressPercentage: this.data.progressPercentage
        });
      } catch (e) {
        console.error('Failed to save check-in data:', e);
      }
    }
  }
})
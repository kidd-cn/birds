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
        name: '深圳湾公园',
        location: '南山区',
        description: '沿海湿地，拥有丰富的水鸟种类',
        birdSpecies: ['黑脸琵鹭', '大白鹭', '小白鹭'],
        difficulty: '简单',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot2',
        name: '西丽湖水库',
        location: '南山区',
        description: '淡水栖息地，周边有森林边缘',
        birdSpecies: ['白喉针尾雨燕', '普通秧鸡', '紫水鸡'],
        difficulty: '中等',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot3',
        name: '大梅沙海滩',
        location: '大鹏新区',
        description: '海岸区域，岩石海岸线',
        birdSpecies: ['鹬鸻', '太平洋金斑鸻', '红腹滨鹬'],
        difficulty: '简单',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot4',
        name: '黄贝岭森林公园',
        location: '福田区',
        description: '城市森林，拥有本土物种',
        birdSpecies: ['大盘尾', '红嘴相思鸟', '黄腹柳莺'],
        difficulty: '困难',
        icon: 'bird-marker.svg'
      },
      {
        id: 'spot5',
        name: '洪湖公园',
        location: '福田区',
        description: '城市湖泊，栖息着候鸟',
        birdSpecies: ['中国池鹭', '紫鹭', '白胸苦恶鸟'],
        difficulty: '简单',
        icon: 'bird-marker.svg'
      }
    ],
    badges: [
      {
        id: 'badge1',
        name: '深圳湾探索者',
        spotId: 'spot1',
        description: '已签到深圳湾公园',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge2',
        name: '西丽湖探险家',
        spotId: 'spot2',
        description: '已签到西丽湖水库',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge3',
        name: '大梅沙海岸行者',
        spotId: 'spot3',
        description: '已签到大梅沙海滩',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge4',
        name: '黄贝岭登山客',
        spotId: 'spot4',
        description: '已签到黄贝岭森林公园',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge5',
        name: '洪湖公园访客',
        spotId: 'spot5',
        description: '已签到洪湖公园',
        icon: 'bird-marker.svg',
        earned: false
      },
      {
        id: 'badge_all_spots',
        name: '观鸟大师',
        description: '已访问全部5个观鸟点',
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
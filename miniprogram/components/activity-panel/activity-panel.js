// Component: Activity Panel
// Modal panel showing three bird-related activity options

Component({
  /**
   * Component properties
   */
  properties: {
    // 控制面板可见性
    visible: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component data
   */
  data: {
    activities: [
      {
        id: 'identification-game',
        title: '识别挑战',
        description: '测试你的鸟类识别技能',
        icon: '🎯'
      },
      {
        id: 'knowledge-quiz',
        title: '知识问答',
        description: '学习有趣的鸟类知识',
        icon: '🧠'
      },
      {
        id: 'check-in',
        title: '打卡记录',
        description: '记录你的观鸟活动',
        icon: '✅'
      }
    ]
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * Close the activity panel
     */
    handleClose(e) {
      this.triggerEvent('close', { visible: false });
    },

    /**
     * Handle activity selection
     */
    handleActivitySelect(e) {
      const activityId = e.currentTarget.dataset.activityId;

      // Find the selected activity
      const selectedActivity = this.data.activities.find(activity => activity.id === activityId);

      // Emit the activity selected event
      this.triggerEvent('activitySelected', {
        activity: selectedActivity,
        activityId: activityId
      });
    },

    /**
     * Handle background click (close panel)
     */
    handleOverlayClick(e) {
      // Only close if clicking on the overlay (not the content area)
      if (e.target.id === 'overlay') {
        this.handleClose();
      }
    }
  }
})
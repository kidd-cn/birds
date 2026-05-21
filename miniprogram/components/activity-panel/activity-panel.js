// Component: Activity Panel
// Modal panel showing three bird-related activity options

Component({
  /**
   * Component properties
   */
  properties: {
    // Controls visibility of the panel
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
        title: 'Identification Game',
        description: 'Test your bird recognition skills',
        icon: '🎯'
      },
      {
        id: 'knowledge-quiz',
        title: 'Knowledge Quiz',
        description: 'Learn interesting facts about birds',
        icon: '🧠'
      },
      {
        id: 'check-in',
        title: 'Check-In',
        description: 'Record your bird watching sessions',
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
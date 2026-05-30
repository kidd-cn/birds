Component({
  properties: {
    topics: {
      type: Array,
      value: []
    },
    completedTopics: {
      type: Array,
      value: []
    }
  },

  data: {
    mapCenter: {
      latitude: 30.5728,
      longitude: 114.2525
    },
    scale: 12
  },

  methods: {
    getMarkers() {
      return this.data.topics.map(topic => ({
        id: topic.id,
        latitude: topic.latitude,
        longitude: topic.longitude,
        width: 40,
        height: 40,
        iconPath: this.getMarkerIcon(topic.isCompleted)
      }));
    },

    getMarkerIcon(isCompleted) {
      // TODO: Return appropriate marker icon path
      return isCompleted ? '/images/marker-completed.png' : '/images/marker-default.png';
    },

    onMarkerTap(e) {
      const { markerId } = e.detail;
      this.triggerEvent('markertap', { markerId });
    }
  }
});
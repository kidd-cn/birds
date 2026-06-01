const avatarSystem = require('../../utils/avatar-system');

Component({
  properties: {
    size: {
      type: String,
      value: 'medium'  // small | medium | large | xlarge
    },
    showName: {
      type: Boolean,
      value: false
    },
    showBorder: {
      type: Boolean,
      value: false
    }
  },

  data: {
    avatarImage: '',
    avatarName: '',
    avatarId: '',
    sizePx: 64
  },

  lifetimes: {
    attached() {
      this.refresh();
    }
  },

  methods: {
    refresh() {
      const equipped = avatarSystem.getEquippedAvatar();
      const sizeMap = { small: 40, medium: 64, large: 120, xlarge: 160 };
      this.setData({
        avatarImage: equipped.image,
        avatarName: equipped.name,
        avatarId: equipped.id,
        sizePx: sizeMap[this.data.size] || 64
      });
    },

    onTap() {
      this.triggerEvent('tap', { avatarId: this.data.avatarId });
    }
  }
});

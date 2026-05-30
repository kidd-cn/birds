// miniprogram/components/star-rating/star-rating.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: false
  },

  properties: {
    // 当前评分值
    rating: {
      type: Number,
      value: 0,
      observer: function(newVal) {
        // Convert to number and handle non-numeric values
        const numericValue = typeof newVal === 'number' ? newVal : parseFloat(newVal) || 0;
        this.setData({
          currentRating: Math.max(0, Math.min(this.data.maxStars, numericValue))
        });
      }
    },
    // 最大星级数
    maxStars: {
      type: Number,
      value: 5
    },
    // 星星大小
    size: {
      type: Number,
      value: 28
    },
    // 星星间距
    spacing: {
      type: Number,
      value: 6
    },
    // 是否交互式（可点击）
    interactive: {
      type: Boolean,
      value: false
    },
    // 星星图标
    starIcon: {
      type: String,
      value: '★' // 使用★符号替代原来的🌟emoji，更统一可控
    },
    // 是否显示评级文字
    showText: {
      type: Boolean,
      value: true
    },
    // 评级文字后缀
    displayTextSuffix: {
      type: String,
      value: '星'
    },
    // 隐藏评级文字（仅显示星星）
    hideRatingText: {
      type: Boolean,
      value: false
    },
    // 文字大小
    textSize: {
      type: Number,
      value: 24
    },
    // 文字颜色
    textColor: {
      type: String,
      value: '#666666'
    }
  },

  data: {
    currentRating: 0,
    starArray: [] // 存储星星数组
  },

  lifetimes: {
    attached() {
      // Convert the rating to a number in case it's not already one
      const numericRating = typeof this.properties.rating === 'number' ? this.properties.rating : parseFloat(this.properties.rating) || 0;
      this.setData({
        currentRating: Math.max(0, Math.min(this.properties.maxStars, numericRating)),
        starArray: this.generateStarArray(this.properties.maxStars)
      });
    }
  },

  observers: {
    'maxStars': function(newMaxStars) {
      // Convert to number in case it's not already one
      const numericMaxStars = typeof newMaxStars === 'number' ? newMaxStars : parseFloat(newMaxStars) || 5;
      this.setData({
        starArray: this.generateStarArray(numericMaxStars)
      });
    }
  },

  methods: {
    generateStarArray(maxStars) {
      // Convert to number in case it's not already one
      const numericMaxStars = typeof maxStars === 'number' ? maxStars : parseFloat(maxStars) || 5;
      const arr = [];
      for (let i = 0; i < numericMaxStars; i++) {
        arr.push(i);
      }
      return arr;
    },

    onStarTap(e) {
      if (!this.properties.interactive) {
        return;
      }

      const index = e.currentTarget.dataset.index;
      const newRating = index + 1;

      this.setData({
        currentRating: newRating
      });

      // 触发评分变更事件
      this.triggerEvent('change', {
        rating: newRating
      });
    }
  }
});
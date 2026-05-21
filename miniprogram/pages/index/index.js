// pages/index/index.js
const { realBirdObservations } = require('../../utils/birdData');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 114.085947, // 深圳中心经度
    latitude: 22.547000,   // 深圳中心纬度
    scale: 12,
    markers: [],
    mapIncludePoints: [],
    showDetail: false,
    currentBird: {},
    birdData: [],
    featuredSpots: [],
    showActivityPanel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const selectedSpot = this.resolveSelectedSpot(options);
    if (selectedSpot) {
      wx.setStorageSync('selectedSpot', selectedSpot);
      this.applyMapCenterFromSpot(selectedSpot);
    }

    // 首先尝试从云端加载数据，如果失败则使用本地数据
    this.loadBirdData()
      .catch(error => {
        console.warn('云端数据加载失败，使用本地数据:', error);
        this.loadLocalBirdData();
      });
  },

  /**
   * 加载鸟类数据
   */
  loadBirdData() {
    return new Promise((resolve, reject) => {
      // 检查是否有选中的观鸟点
      const selectedSpot = wx.getStorageSync('selectedSpot');

      if (selectedSpot) {
        // 如果有选中的观鸟点，则获取该地点的特定数据
        this.loadBirdDataBySpot(selectedSpot.name)
          .then(success => {
            if (success) {
              resolve(true);
            } else {
              // 如果云端获取失败，使用本地数据
              console.log('云端数据加载失败，使用本地数据');
              this.loadLocalBirdData();
              resolve(false);
            }
          })
          .catch(error => {
            console.error('云端数据加载失败，使用本地数据:', error);
            this.loadLocalBirdData();
            resolve(false);
          });
      } else {
        // 否则获取深圳代表性观鸟点的数据
        this.loadBirdDataFromCloud()
          .then(success => {
            if (success) {
              resolve(true);
            } else {
              // 如果云端获取失败，使用本地数据
              console.log('云端数据加载失败，使用本地数据');
              this.loadLocalBirdData();
              resolve(false);
            }
          })
          .catch(error => {
            console.error('云端数据加载失败，使用本地数据:', error);
            this.loadLocalBirdData();
            resolve(false);
          });
      }
    });
  },

  /**
   * 从云端加载指定观鸟点的鸟类数据
   */
  async loadBirdDataBySpot(spotName) {
    try {
      // 调用云函数获取特定观鸟点的鸟类观察数据
      const result = await wx.cloud.callFunction({
        name: 'getBirdDataBySpot',
        data: {
          spotName: spotName,
          limit: 100
        }
      });

      if (result.result.success) {
        const birdData = result.result.data;

        this.updateMapMarkers(birdData, {
          selectedSpot: result.result.selectedSpot,
          extra: { selectedSpot: result.result.selectedSpot }
        });

        const storedSpot = wx.getStorageSync('selectedSpot');
        this.applyMapCenterFromSpot(storedSpot || result.result.selectedSpot);

        return true;
      }
    } catch (error) {
      console.error('从云端加载指定观鸟点鸟类数据失败:', error);
      // 抛出错误以便调用者可以处理
      throw error;
    }
  },

  /**
   * 从云端加载代表性观鸟点的鸟类数据
   */
  async loadBirdDataFromCloud() {
    try {
      // 调用云函数获取深圳代表性观鸟点的鸟类观察数据
      const result = await wx.cloud.callFunction({
        name: 'getFeaturedBirdingSpots',
        data: {
          includeNearby: false,
          limit: 100
        }
      });

      if (result.result.success) {
        const birdData = result.result.data;

        this.updateMapMarkers(birdData, {
          extra: { featuredSpots: result.result.spotsList }
        });

        return true;
      }
    } catch (error) {
      console.error('从云端加载鸟类数据失败:', error);
      // 抛出错误以便调用者可以处理
      throw error;
    }
  },

  /**
   * 加载本地鸟类数据（备用）
   */
  loadLocalBirdData() {
    let birdData = require('../../utils/birdData').realBirdObservations;
    const selectedSpot = wx.getStorageSync('selectedSpot');

    if (selectedSpot && selectedSpot.name) {
      const filtered = birdData.filter(bird =>
        bird.locationName === selectedSpot.name ||
        bird.locationName.includes(selectedSpot.name) ||
        selectedSpot.name.includes(bird.locationName)
      );
      if (filtered.length > 0) {
        birdData = filtered;
      }
      this.applyMapCenterFromSpot(selectedSpot);
    }

    // 处理图片路径，确保使用正确的本地图片资源
    birdData = birdData.map(bird => {
      // 定义一个默认图片
      const defaultImageUrl = '/images/Black_faced_spoonbill.jpeg';

      // 检查图片路径并进行标准化处理
      let correctedImageUrl = bird.imageUrl;

      // 确保图片路径正确
      if (!correctedImageUrl || correctedImageUrl.trim() === '') {
        correctedImageUrl = defaultImageUrl;
      } else if (!correctedImageUrl.startsWith('/')) {
        // 如果不是绝对路径，添加绝对路径前缀
        correctedImageUrl = '/' + correctedImageUrl.replace('//', '/');
      }

      // 验证图片路径是否指向存在的文件
      if (!this.isValidImagePath(correctedImageUrl)) {
        correctedImageUrl = defaultImageUrl;
      }

      return {
        ...bird,
        imageUrl: correctedImageUrl
      };
    });

    this.updateMapMarkers(birdData);
  },

  /**
   * 验证图片路径是否有效
   */
  isValidImagePath(imagePath) {
    // 检查是否为网络图片
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return true;
    }

    // 检查是否为本地路径
    if (imagePath.startsWith('/')) {
      // 移除开头的斜杠以匹配实际文件路径
      const relativePath = '.' + imagePath;
      try {
        // 尝试检查文件是否存在
        const fs = wx.getFileSystemManager();
        const stat = fs.statSync(relativePath, true);
        return stat.isDirectory === false;
      } catch (e) {
        // 如果无法访问文件，返回false
        return false;
      }
    }

    return false;
  },

  /**
   * 点击标记事件
   */
  onMarkerTap(e) {
    const markerId = e.detail.markerId;
    const selectedBird = this.data.birdData.find(bird => {
      const birdMarkerId = bird._id
        ? parseInt(bird._id.slice(-6), 16)
        : bird.id;
      return birdMarkerId === markerId;
    });

    if (selectedBird) {
      this.setData({
        showDetail: true,
        currentBird: selectedBird
      });
    }
  },

  /**
   * 关闭详情弹窗
   */
  closeDetail() {
    this.setData({
      showDetail: false,
      currentBird: {}
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const selectedSpot = wx.getStorageSync('selectedSpot');
    if (selectedSpot) {
      // 地图组件渲染后再定位一次，确保中心点生效
      setTimeout(() => {
        this.applyMapCenterFromSpot(selectedSpot);
      }, 100);
    }
  },

  resolveSelectedSpot(options = {}) {
    if (options.latitude && options.longitude) {
      return {
        name: options.spotName ? decodeURIComponent(options.spotName) : '',
        coordinates: {
          latitude: Number(options.latitude),
          longitude: Number(options.longitude)
        }
      };
    }

    return wx.getStorageSync('selectedSpot') || null;
  },

  applyMapCenterFromSpot(spot) {
    const coords = spot && spot.coordinates;
    if (!coords) return false;

    const latitude = Number(coords.latitude);
    const longitude = Number(coords.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return false;

    this.setData({
      longitude,
      latitude,
      scale: 14
    });
    return true;
  },

  buildBirdMarkers(birdData) {
    return birdData.map(bird => ({
      id: bird._id ? parseInt(bird._id.slice(-6), 16) : bird.id,
      latitude: bird.location.latitude,
      longitude: bird.location.longitude,
      width: 30,
      height: 30,
      callout: {
        content: `${bird.commonName || bird.species}\n${bird.locationName}`,
        display: 'BYCLICK',
        padding: 8,
        borderRadius: 4,
        bgColor: '#ffffff',
        color: '#000000',
        fontSize: 10,
        textAlign: 'center'
      },
      label: {
        content: (bird.commonName || bird.species || '?').charAt(0),
        color: '#ffffff',
        fontSize: 12,
        bgColor: '#4CAF50',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5
      }
    }));
  },

  updateMapMarkers(birdData, options = {}) {
    const markers = this.buildBirdMarkers(birdData);
    const selectedSpot = wx.getStorageSync('selectedSpot');
    let mapIncludePoints;

    if (selectedSpot && selectedSpot.coordinates) {
      mapIncludePoints = [
        {
          latitude: Number(selectedSpot.coordinates.latitude),
          longitude: Number(selectedSpot.coordinates.longitude)
        },
        ...markers.map(marker => ({
          latitude: marker.latitude,
          longitude: marker.longitude
        }))
      ];
    } else {
      mapIncludePoints = markers.map(marker => ({
        latitude: marker.latitude,
        longitude: marker.longitude
      }));
    }

    this.setData({
      markers,
      birdData,
      mapIncludePoints,
      ...(options.extra || {})
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时检查是否有选中的观鸟点，如果有则重新加载数据
    const selectedSpot = wx.getStorageSync('selectedSpot');
    if (selectedSpot &&
        (!this.data.selectedSpot || this.data.selectedSpot.name !== selectedSpot.name)) {
      this.applyMapCenterFromSpot(selectedSpot);

      // 重新加载数据以反映所选观鸟点
      this.loadBirdData()
        .catch(error => {
          console.warn('云端数据加载失败，使用本地数据:', error);
          this.loadLocalBirdData();
        });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏时执行
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时执行
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新时执行
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉触底时执行
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // 分享时返回的内容
    return {
      title: '深圳鸟类分布图',
      path: '/pages/index/index'
    };
  },

  /**
   * 显示活动面板
   */
  showActivityPanel() {
    this.setData({
      showActivityPanel: true
    });
  },

  /**
   * 隐藏活动面板
   */
  hideActivityPanel() {
    this.setData({
      showActivityPanel: false
    });
  },

  /**
   * 预览鸟类图片
   */
  previewBirdImage() {
    if (this.data.currentBird && this.data.currentBird.imageUrl) {
      wx.previewImage({
        urls: [this.data.currentBird.imageUrl],
        current: this.data.currentBird.imageUrl
      });
    }
  }
});
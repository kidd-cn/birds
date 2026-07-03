const pointsSystem = require('../../utils/points-system');
const avatarSystem = require('../../utils/avatar-system');

const TIER_ORDER = ['normal', 'rare', 'epic'];
const TIER_NAMES = { normal: '普通', rare: '稀有', epic: '史诗' };

Page({
  data: {
    currentPoints: 0,
    totalEarned: 0,
    equippedAvatar: {},
    currentTier: 'normal',
    tierNames: TIER_NAMES,
    tiers: TIER_ORDER.map(t => ({
      key: t,
      name: TIER_NAMES[t]
    })),
    avatars: [],
    pendingPurchaseId: ''
  },

  onLoad() {
    this.refresh();
    this.unsubscribe = pointsSystem.onChange(() => this.refresh());
    this.unsubscribe2 = avatarSystem.onChange(() => this.refresh());
  },

  onUnload() {
    if (this.unsubscribe) this.unsubscribe();
    if (this.unsubscribe2) this.unsubscribe2();
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const avatars = avatarSystem.getAllAvatars();
    const equipped = avatarSystem.getEquippedAvatar();
    this.setData({
      currentPoints: pointsSystem.getCurrentPoints(),
      totalEarned: pointsSystem.getTotalEarned(),
      equippedAvatar: equipped,
      avatars
    });
  },

  onSelectTier(e) {
    const tier = e.currentTarget.dataset.tier;
    this.setData({ currentTier: tier });
  },

  onCardImgError(e) {
    // 头像图片加载失败时回退到默认图
    const index = e.currentTarget.dataset.index;
    const key = `avatars[${index}].image`;
    this.setData({ [key]: '/images/default-bird.jpg' });
  },

  onAvatarTap(e) {
    const avatarId = e.currentTarget.dataset.id;
    const avatar = this.data.avatars.find(a => a.id === avatarId);
    if (!avatar) return;

    if (!avatar.unlocked) {
      const need = avatar.unlockAt - this.data.totalEarned;
      wx.showToast({ title: `再获得 ${need} 积分可解锁`, icon: 'none' });
      return;
    }
    if (avatar.equipped) {
      wx.showToast({ title: '当前使用中', icon: 'none' });
      return;
    }
    if (avatar.owned) {
      const r = avatarSystem.equipAvatar(avatarId);
      if (r.success) {
        wx.showToast({ title: `已装备：${avatar.name}`, icon: 'success' });
        this.refresh();
      }
      return;
    }
    // 未拥有 → 尝试兑换
    const r = avatarSystem.purchaseAvatar(avatarId);
    if (r.success) {
      this.setData({ pendingPurchaseId: avatarId });
      wx.showModal({
        title: '兑换成功',
        content: `已获得「${avatar.name}」，是否立即装备？`,
        success: (res) => {
          if (res.confirm) {
            avatarSystem.equipAvatar(avatarId);
          }
          this.setData({ pendingPurchaseId: '' });
          this.refresh();
        }
      });
    } else {
      const messages = {
        insufficient_points: '积分不足',
        tier_locked: '档位未解锁',
        already_owned: '已拥有'
      };
      wx.showToast({ title: messages[r.reason] || '兑换失败', icon: 'none' });
    }
  }
});

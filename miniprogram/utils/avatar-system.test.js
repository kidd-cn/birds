// Mock wx global with isolated storage
const mockStorage = {};
global.wx = {
  getStorageSync: (key) => mockStorage[key] || null,
  setStorageSync: (key, val) => { mockStorage[key] = val; }
};

function clearStorage() { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }

// Clear require cache
delete require.cache[require.resolve('./avatar-system')];
delete require.cache[require.resolve('./points-system')];

const ps = require('./points-system');
const av = require('./avatar-system');
const assert = require('assert');

clearStorage();
ps.reset();
av.reset();

// Test 1: 首次启动 init 后拥有 sparrow
av.init();
let all = av.getAllAvatars();
const sparrow = all.find(a => a.id === 'sparrow');
assert.ok(sparrow, 'sparrow should exist');
assert.ok(sparrow.owned, 'sparrow should be owned by default');
assert.strictEqual(sparrow.equipped, true, 'sparrow should be equipped by default');

// Test 2: getEquippedAvatar 默认是 sparrow
let equipped = av.getEquippedAvatar();
assert.strictEqual(equipped.id, 'sparrow');

// Test 3: 档位解锁 - 普通默认全部可见
all = av.getAllAvatars();
const normalAvatars = all.filter(a => a.tier === 'normal');
assert.ok(normalAvatars.every(a => a.unlocked === true), 'normal tier always unlocked');

const rareAvatars = all.filter(a => a.tier === 'rare');
const epicAvatars = all.filter(a => a.tier === 'epic');

// Test 4: 积分不足时稀有档位未解锁
ps.reset();
ps.addPoints('test:setup', 50); // totalEarned=50
av.reset();
av.init();
all = av.getAllAvatars();
const rare = all.filter(a => a.tier === 'rare');
assert.strictEqual(rare[0].unlocked, false, 'rare should be locked when totalEarned<100');

// Test 5: 积分达到 100 时稀有档位解锁
ps.addPoints('test:more', 50); // totalEarned=100
all = av.getAllAvatars();
assert.strictEqual(all.find(a => a.id === 'hoopoe').unlocked, true, 'rare unlocked at 100');

// Test 6: purchaseAvatar 成功
ps.addPoints('test:more2', 200); // totalEarned=300
const r1 = av.purchaseAvatar('pigeon');
assert.strictEqual(r1.success, true, `should purchase: ${r1.reason}`);
assert.ok(av.getAllAvatars().find(a => a.id === 'pigeon').owned);

// Test 7: purchaseAvatar 积分不足
ps.reset();
ps.addPoints('test:low', 10); // totalEarned=10
av.reset();
av.init();
const r2 = av.purchaseAvatar('hoopoe'); // hoopoe locked
assert.strictEqual(r2.success, false);
assert.strictEqual(r2.reason, 'tier_locked');

// Test 8: purchaseAvatar 已拥有
ps.addPoints('test:enough', 500);
av.reset();
av.init();
av.purchaseAvatar('pigeon');
const r3 = av.purchaseAvatar('pigeon');
assert.strictEqual(r3.success, false);
assert.strictEqual(r3.reason, 'already_owned');

// Test 9: equipAvatar 成功
const r4 = av.equipAvatar('pigeon');
assert.strictEqual(r4.success, true);
assert.strictEqual(av.getEquippedAvatar().id, 'pigeon');

// Test 10: equipAvatar 未拥有
av.reset();
av.init();
const r5 = av.equipAvatar('hoopoe');
assert.strictEqual(r5.success, false);
assert.strictEqual(r5.reason, 'not_owned');

// Test 11: getTotalEarned 返回 NaN 时 getAllAvatars 不应崩溃
const originalGetTotalEarned = ps.getTotalEarned;
ps.getTotalEarned = () => NaN;
av.reset();
av.init();
assert.doesNotThrow(() => av.getAllAvatars(), 'getAllAvatars should not throw when totalEarned is NaN');
const nanAll = av.getAllAvatars();
assert.strictEqual(nanAll.length, av.AVATARS.length, 'should still return all avatars when totalEarned is NaN');
ps.getTotalEarned = originalGetTotalEarned;

// Test 12: init() 修复 equippedAvatar 不在 ownedAvatars 中的情况
clearStorage();
mockStorage['avatar-system'] = { ownedAvatars: ['sparrow'], equippedAvatar: 'ghost' };
delete require.cache[require.resolve('./avatar-system')];
const av2 = require('./avatar-system');
av2.init();
assert.strictEqual(
  av2.getEquippedAvatar().id,
  'sparrow',
  'init() should repair equippedAvatar that is not in ownedAvatars'
);

// Test 13: load() 处理损坏的 ownedAvatars (非数组) - 回退到默认值
clearStorage();
mockStorage['avatar-system'] = { ownedAvatars: 'not-an-array', equippedAvatar: 'sparrow' };
delete require.cache[require.resolve('./avatar-system')];
const av3 = require('./avatar-system');
av3.init();
const corruptAll = av3.getAllAvatars();
const sparrowAfterCorrupt = corruptAll.find(a => a.id === 'sparrow');
assert.strictEqual(sparrowAfterCorrupt.owned, true, 'sparrow should be owned after corrupt array fallback');
const ownedCount = corruptAll.filter(a => a.owned).length;
assert.strictEqual(ownedCount, 1, 'only default avatar should be owned after corrupt ownedAvatars fallback');

console.log('✓ All avatar-system tests passed');

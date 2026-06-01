// Mock wx global
global.wx = {
  getStorageSync: () => null,
  setStorageSync: () => {}
};

// Clear require cache
delete require.cache[require.resolve('./points-system')];

const ps = require('./points-system');
const assert = require('assert');

// Reset
ps.reset();

// Test 1: addPoints 首次
let r = ps.addPoints('test:1', 5);
assert.strictEqual(r.awarded, true, 'should award on first call');
assert.strictEqual(r.currentPoints, 5);
assert.strictEqual(r.totalEarned, 5);

// Test 2: addPoints 重复
r = ps.addPoints('test:1', 5);
assert.strictEqual(r.awarded, false, 'should not award duplicate key');
assert.strictEqual(r.currentPoints, 5, 'currentPoints unchanged');
assert.strictEqual(r.totalEarned, 5, 'totalEarned unchanged');

// Test 3: spendPoints 充足
r = ps.spendPoints(3, 'test purchase');
assert.strictEqual(r.success, true);
assert.strictEqual(r.currentPoints, 2);

// Test 4: spendPoints 不足
r = ps.spendPoints(100, 'too expensive');
assert.strictEqual(r.success, false);
assert.strictEqual(r.reason, 'insufficient_points');
assert.strictEqual(ps.getCurrentPoints(), 2, 'balance unchanged on failed spend');

// Test 5: spendPoints 后 totalEarned 不变
assert.strictEqual(ps.getTotalEarned(), 5, 'spend does not reduce totalEarned');

// Test 6: onChange 触发
let changeCount = 0;
const unsub = ps.onChange(() => { changeCount++; });
ps.addPoints('test:trigger', 1);
assert.strictEqual(changeCount >= 1, true, 'listener called on addPoints');
ps.spendPoints(1, 'test');
assert.strictEqual(changeCount >= 2, true, 'listener called on spendPoints');
unsub();

console.log('✓ All points-system tests passed');

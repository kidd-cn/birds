// Mock wx global
global.wx = {
  getStorageSync: () => null,
  setStorageSync: () => {}
};

const ps = require('../../miniprogram/utils/points-system.js');
const assert = require('assert');

// Tests run in a linear flow and share state via the points-system module.
// ps.reset() is called between scenarios to ensure isolation.

// Test 1: addPoints 首次
ps.reset();
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

// Test 6: onChange 触发 + unsubscribe 实际移除
ps.reset();
let changeCount = 0;
const unsub = ps.onChange(() => { changeCount++; });
ps.addPoints('test:trigger', 1);
assert.strictEqual(changeCount >= 1, true, 'listener called on addPoints');
ps.spendPoints(1, 'test');
assert.strictEqual(changeCount >= 2, true, 'listener called on spendPoints');
unsub();
ps.addPoints('test:after-unsub', 1);
assert.strictEqual(changeCount, 2, 'listener removed after unsubscribe');

// Test 7: edge case - empty key
ps.reset();
r = ps.addPoints('', 5);
assert.strictEqual(r.awarded, false, 'empty key should not award');
assert.strictEqual(ps.getCurrentPoints(), 0);
assert.strictEqual(ps.getTotalEarned(), 0);

// Test 8: edge case - negative amount
ps.reset();
r = ps.addPoints('valid', -5);
assert.strictEqual(r.awarded, false, 'negative amount should not award');
assert.strictEqual(ps.getCurrentPoints(), 0);
assert.strictEqual(ps.getTotalEarned(), 0);

// Test 9: edge case - NaN amount
ps.reset();
r = ps.addPoints('valid', NaN);
assert.strictEqual(r.awarded, false, 'NaN amount should not award');
assert.strictEqual(ps.getCurrentPoints(), 0, 'no corruption from NaN');
assert.strictEqual(ps.getTotalEarned(), 0, 'no corruption from NaN');

// Test 10: edge case - spendPoints NaN
ps.reset();
ps.addPoints('seed', 10);
r = ps.spendPoints(NaN, 'test');
assert.strictEqual(r.success, false, 'NaN spend should fail');
assert.strictEqual(r.reason, 'invalid_amount');
assert.strictEqual(ps.getCurrentPoints(), 10, 'balance unchanged on NaN spend');

// Test 11: onChange with non-function returns a no-op unsub
const nonFnUnsub = ps.onChange(null);
assert.strictEqual(typeof nonFnUnsub, 'function', 'returns function for non-function callback');
assert.doesNotThrow(() => nonFnUnsub(), 'no-op unsub should not throw');

console.log('✓ All points-system tests passed');

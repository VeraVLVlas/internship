// start test
// cd "учебная_практика_14.09.2026/Разработка ядра бизнес-логики (Расчет скидки)"
// node --test calculatePartnerDiscount.test.js

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePartnerDiscount } from './calculatePartnerDiscount.js';

test('returns 0% for 9999 units', () => {
  assert.equal(calculatePartnerDiscount(9999), 0);
});

test('returns 5% for 10000 units', () => {
  assert.equal(calculatePartnerDiscount(10000), 5);
});

test('returns 5% for 49999 units', () => {
  assert.equal(calculatePartnerDiscount(49999), 5);
});

test('returns 10% for 50000 units', () => {
  assert.equal(calculatePartnerDiscount(50000), 10);
});

test('returns 10% for 299999 units', () => {
  assert.equal(calculatePartnerDiscount(299999), 10);
});

test('returns 15% for 300000 units', () => {
  assert.equal(calculatePartnerDiscount(300000), 15);
});

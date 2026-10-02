import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateMaterialRequirement
} from './calculateMaterialRequirement.js';


test('calculates material requirement for valid data', () => {
  const result = calculateMaterialRequirement(
    3,
    2,
    5,
    2,
    5
  );

  assert.equal(result, 101);
});


test('rounds fractional result up', () => {
  const result = calculateMaterialRequirement(
    1,
    2,
    10,
    2.5,
    4
  );

  assert.equal(result, 112);
});


test('returns -1 for unknown product type', () => {
  const result = calculateMaterialRequirement(
    999,
    1,
    10,
    2,
    3
  );

  assert.equal(result, -1);
});


test('returns -1 for unknown material type', () => {
  const result = calculateMaterialRequirement(
    1,
    999,
    10,
    2,
    3
  );

  assert.equal(result, -1);
});


test('returns -1 for negative product parameter', () => {
  const result = calculateMaterialRequirement(
    1,
    1,
    10,
    -2,
    3
  );

  assert.equal(result, -1);
});


test('returns -1 for negative second product parameter', () => {
  const result = calculateMaterialRequirement(
    1,
    1,
    10,
    2,
    -3
  );

  assert.equal(result, -1);
});


test('returns -1 for zero quantity', () => {
  const result = calculateMaterialRequirement(
    1,
    1,
    0,
    2,
    3
  );

  assert.equal(result, -1);
});


test('returns -1 for negative quantity', () => {
  const result = calculateMaterialRequirement(
    1,
    1,
    -5,
    2,
    3
  );

  assert.equal(result, -1);
});

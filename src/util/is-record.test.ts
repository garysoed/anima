import {expect, test} from '@playwright/test';

import {isRecord} from './is-record';

test.describe('isRecord', () => {
  test('returns true for empty plain object', () => {
    expect(isRecord({})).toBe(true);
  });

  test('returns true for object with properties', () => {
    expect(isRecord({key: 'value'})).toBe(true);
  });

  test('returns false for null', () => {
    expect(isRecord(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isRecord(undefined)).toBe(false);
  });

  test('returns false for arrays', () => {
    expect(isRecord([])).toBe(false);
  });

  test('returns false for primitive values', () => {
    expect(isRecord('string')).toBe(false);
    expect(isRecord(123)).toBe(false);
    expect(isRecord(true)).toBe(false);
  });
});

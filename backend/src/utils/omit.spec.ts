import { omit } from './omit';
import assert = require('assert');

describe('omit()', () => {
  it('should clone an object without specified properties', () => {
    const input = {a: 1, b: 2, c: ['what', 'ever'], d: {inner: 'property'}};
    const output = {b: 2, d: {inner: 'property'}};

    assert.deepEqual(omit(input, 'a', 'c'), output);
  });
});

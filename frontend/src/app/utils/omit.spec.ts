import { omit } from './omit';

describe('omit()', () => {
  it('should clone an object without specified properties', () => {
    const input = {a: 1, b: 2, c: ['what', 'ever'], d: {inner: 'property'}};
    const output = {b: 2, d: {inner: 'property'}};

    expect(omit(input, 'a', 'c')).toEqual(output);
  });
});

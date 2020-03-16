import { extractPropertiesBasedOnOtherObject } from './extract';

describe('extractPropertiesBasedOnOtherObject()', () => {
  it('should extract a new object based on another object', () => {
    const rawObj = {a: 1, b: 2, c: 3, d: 'd', e: true};
    const otherObj = {a: 0, d: 'string', e: false};
    const expectObj = {a: 1, d: 'd', e: true};
    expect(extractPropertiesBasedOnOtherObject(rawObj, otherObj)).toEqual(expectObj);
  });
});

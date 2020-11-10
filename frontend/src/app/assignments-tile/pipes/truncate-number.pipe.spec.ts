import { TruncateNumberPipe } from './truncate-number.pipe';

describe('TruncateNumberPipe', () => {
  it('should create an instance', () => {
    const pipe = new TruncateNumberPipe();
    expect(pipe).toBeTruthy();
  });

  describe('when a number is not bigger than 999', () => {
    it('should return the same number converted to string', () => {
      const pipe = new TruncateNumberPipe();
      expect(pipe.transform(0)).toEqual('0');
      expect(pipe.transform(1)).toEqual('1');
      expect(pipe.transform(999)).toEqual('999');
    });
  });

  describe('when a number is bigger than 999', () => {
    it('should return the same number converted to string', () => {
      const pipe = new TruncateNumberPipe();
      expect(pipe.transform(1000)).toEqual('999+');
      expect(pipe.transform(123456789)).toEqual('999+');
    });
  });
});

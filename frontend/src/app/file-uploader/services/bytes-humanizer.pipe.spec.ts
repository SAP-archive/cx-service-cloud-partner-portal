import { BytesHumanizerPipe } from './bytes-humanizer.pipe';

describe('BytesTransformrPipe', () => {
  let pipe: BytesHumanizerPipe;

  beforeEach(() => {
    pipe = new BytesHumanizerPipe();
  });

  describe('transform()', () => {
    it(`should return size in kilobytes if input value is less then 1mb`, () => {
      expect(pipe.transform(5e+5)).toEqual('500kb');
      expect(pipe.transform(1e+5)).toEqual('100kb');
      expect(pipe.transform(2e+4)).toEqual('20kb');
    });

    it(`should return size in megabytes if input value is more then 1mb`, () => {
      expect(pipe.transform(1e+6)).toEqual('1mb');
      expect(pipe.transform(5e+6)).toEqual('5mb');
      expect(pipe.transform(1e+8)).toEqual('100mb');
    });
  });
});

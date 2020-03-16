import { RadiusInMetersPipe } from './radius-in-meters.pipe';

describe('RadiusInMetersPipe', () => {
  describe('transform()', () => {
    it('should convert data in kilometers to meters', () => {
      const result = new RadiusInMetersPipe().transform(1, 'km');
      expect(result).toEqual(1000);
    });

    it('should convert data in miles to meters', () => {
      const result = new RadiusInMetersPipe().transform(1, 'mi');
      expect(result).toEqual(1609.344);
    });
  });
});

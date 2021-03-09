import { downgradePagingTotalsByOneItem } from './downgrade-paging-totals-by-one-item';

describe('downgradePagingTotalsByOneItem()', () => {
  it('should downgrade totalElements by one', () => {
    const totalElements = 123;
    const result = downgradePagingTotalsByOneItem(3, totalElements);
    expect(result.totalElements).toEqual(totalElements - 1);
  });

  it('should downgrade totalPages if necessary', () => {
    expect(downgradePagingTotalsByOneItem(3, 123).totalPages).toEqual(3);
    expect(downgradePagingTotalsByOneItem(3, 151).totalPages).toEqual(3);
    expect(downgradePagingTotalsByOneItem(3, 152).totalPages).toEqual(4);
  });
});

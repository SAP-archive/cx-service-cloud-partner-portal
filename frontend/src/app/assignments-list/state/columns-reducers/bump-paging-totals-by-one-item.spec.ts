import { bumpPagingTotalsByOneItem } from './bump-paging-totals-by-one-item';

describe('bumpPagingTotalsByOneItem()', () => {
  it('should bump totalElements by one', () => {
    const totalElements = 123;
    const result = bumpPagingTotalsByOneItem(3, totalElements);
    expect(result.totalElements).toEqual(totalElements + 1);
  });

  it('should bump totalPages if necessary', () => {
    expect(bumpPagingTotalsByOneItem(3, 123).totalPages).toEqual(3);
    expect(bumpPagingTotalsByOneItem(3, 149).totalPages).toEqual(3);
    expect(bumpPagingTotalsByOneItem(3, 150).totalPages).toEqual(4);
  });
});

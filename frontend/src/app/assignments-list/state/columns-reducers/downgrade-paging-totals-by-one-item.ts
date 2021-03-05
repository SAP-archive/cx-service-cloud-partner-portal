import { pageSize } from '../../page-size';
import { ColumnState } from '../column-state';

export const downgradePagingTotalsByOneItem = (totalPages: number, totalElements: number): Partial<ColumnState> => {
  return {
    totalElements: totalElements - 1,
    totalPages: Math.ceil((totalElements - 1) / pageSize),
  };
};

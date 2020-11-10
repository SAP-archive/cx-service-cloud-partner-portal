import { FetchingFilter } from './fetching-filter';

export interface FetchingParams {
  pagesLoaded: number;
  totalPages: number;
  totalElements: number;
  filter?: FetchingFilter;
}

export const emptyFetchingParams = (): FetchingParams => {
  return {
    pagesLoaded: 0,
    totalPages: 0,
    totalElements: 0,
  };
};

export const exampleFetchingParams = (): FetchingParams => {
  return {
    pagesLoaded: 1,
    totalPages: 2,
    totalElements: 20,
  };
};

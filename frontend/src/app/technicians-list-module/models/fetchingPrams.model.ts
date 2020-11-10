export interface FetchingParams {
    pagesLoaded: number;
    totalPages: number;
    totalElements: number;
    name: string;
  }

export const emptyFetchingParams = (): FetchingParams => {
  return {
    pagesLoaded: 0,
    totalPages: 0,
    totalElements: 0,
    name: ''
  };
};

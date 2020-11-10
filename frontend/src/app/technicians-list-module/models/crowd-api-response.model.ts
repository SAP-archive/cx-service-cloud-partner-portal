import { Technician, exampleTechnician } from './technician.model';

export interface CrowdApiResponse<T> {
  results: T[];
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
}

export const emptySearchTechniciansResult = (): CrowdApiResponse<Technician> => {
  return {
    results: [],
    numberOfElements: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  };
};

export const exampleSearchTechniciansResult = (): CrowdApiResponse<Technician> => {
  return {
    results: [exampleTechnician()],
    numberOfElements: 1,
    size: 40,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true
  };
};

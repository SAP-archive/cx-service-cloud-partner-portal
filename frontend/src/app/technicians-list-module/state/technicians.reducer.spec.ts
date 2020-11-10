import { initialState, reducer, State } from './technicians.reducer';
import { loadTechnicians, loadTechniciansFailure, loadTechniciansSuccess, searchTechniciansSuccess } from './technicians.actions';
import { exampleTechnician } from '../models/technician.model';

describe('Technicians Reducer', () => {
  describe('on searchTechniciansSuccess', () => {
    it('should set technicians', () => {
      const action = searchTechniciansSuccess({results: [exampleTechnician()], totalPages: 2, totalElements: 50});
      const result: State = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        fetchingParams: {
          ...initialState.fetchingParams,
          pagesLoaded: initialState.fetchingParams.pagesLoaded + 1,
          totalPages: 2,
          totalElements: 50,
        },
        ids: [exampleTechnician().externalId],
        entities: {[exampleTechnician().externalId]: exampleTechnician()}
        } as State);
      });

    it('should set isLoading to false', () => {
      const action = searchTechniciansSuccess({results: [exampleTechnician()]});
      const result = reducer({...initialState, isLoading: true}, action);
      expect(result.isLoading).toBeFalse();
    });
});
  describe('on loadTechniciansSuccess', () => {
    it('should set technicians', () => {
      const action = loadTechniciansSuccess({results: [exampleTechnician()], totalPages: 2, totalElements: 50});
      const result: State = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        isLoading: false,
        fetchingParams: {
            ...initialState.fetchingParams,
            pagesLoaded: initialState.fetchingParams.pagesLoaded + 1,
            totalPages: 2,
            totalElements: 50,
        },
        ids: [exampleTechnician().externalId],
        entities: {123213123213: exampleTechnician()}
      } as State);
    });

    it('should set isLoading to false', () => {
      const action = loadTechniciansSuccess({results: [exampleTechnician()]});
      const result = reducer({...initialState, isLoading: true}, action);
      expect(result.isLoading).toBeFalse();
    });
  });

  describe('on loadTechnicians', () => {
    it('should set isLoading to true', () => {
      const result = reducer(initialState, loadTechnicians());
      expect(result.isLoading).toBeTrue();
    });
  });

  describe('on loadTechniciansFailure', () => {
    it('should set isLoading to false', () => {
      const result = reducer({...initialState, isLoading: true}, loadTechniciansFailure({error: 'error'}));
      expect(result.isLoading).toBeFalse();
    });
  });
});

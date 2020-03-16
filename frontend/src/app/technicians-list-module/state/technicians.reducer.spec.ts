import { initialState, reducer, State } from './technicians.reducer';
import { deleteTechnician, loadTechnicians, loadTechniciansFailure, loadTechniciansSuccess, deleteTechnicianFailure, deleteTechnicianSuccess } from './technicians.actions';
import { exampleTechnician } from '../models/technician.model';

describe('Technicians Reducer', () => {
  describe('on loadTechniciansSuccess', () => {
    it('should set technicians', () => {
      const action = loadTechniciansSuccess({data: [exampleTechnician()]});
      const result: State = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        technicians: [
          exampleTechnician(),
        ],
      } as State);
    });

    it('should set isLoading to false', () => {
      const action = loadTechniciansSuccess({data: [exampleTechnician()]});
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

  describe('on deleteTechnician', () => {
    it('should set toBeDeleted to true', () => {
      const result = reducer(
        {...initialState, technicians: [exampleTechnician('1'), exampleTechnician('2')]},
        deleteTechnician({technician: exampleTechnician('1')})
      );
      expect(result.technicians).toEqual([exampleTechnician('1', true), exampleTechnician('2')]);
    });
  });

  describe('on deleteTechnicianSuccess', () => {
    it('should remove technician from the list', () => {
      const result = reducer(
        {...initialState, technicians: [exampleTechnician('1'), exampleTechnician('2')]},
        deleteTechnicianSuccess({technician: exampleTechnician('1')})
      );
      expect(result.technicians).toEqual([exampleTechnician('2')]);
    });
  });

  describe('on deleteTechnicianFailure', () => {
    it('should set toBeDeleted to false', () => {
      const result = reducer(
        {...initialState, technicians: [exampleTechnician('1', true), exampleTechnician('2')]},
        deleteTechnicianFailure({technician: exampleTechnician('1')})
      );
      expect(result.technicians).toEqual([exampleTechnician('1', false), exampleTechnician('2')]);
    });
  });
});

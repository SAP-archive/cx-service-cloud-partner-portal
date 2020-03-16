import * as fromTechnicians from './technicians.reducer';
import { selectTechniciansState, selectTechnicians } from './technicians.selectors';
import { exampleTechnician } from '../models/technician.model';

describe('Technicians Selectors', () => {
  it('should select the feature state', () => {
    const result = selectTechniciansState({
      [fromTechnicians.techniciansFeatureKey]: {}
    });
    expect(result).toEqual({} as any);
  });

  it('selectTechnicians should work', () => {
    const technicians = [exampleTechnician()];
    const result = selectTechnicians({
      [fromTechnicians.techniciansFeatureKey]: {
        technicians,
      }
    });
    expect(result).toEqual(technicians);
  });
});

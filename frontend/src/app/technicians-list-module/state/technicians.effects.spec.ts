import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import * as ReportingActions from '../../state/reporting/reporting.actions';
import { TechniciansEffects } from './technicians.effects';
import { TechnicianService } from '../services/technicians.service';
import { cold, hot } from 'jasmine-marbles';
import { deleteTechnician, deleteTechnicianSuccess, loadTechnicians, loadTechniciansSuccess } from './technicians.actions';
import { exampleTechnician } from '../models/technician.model';

describe('TechniciansEffects', () => {
  let actions$: Observable<any>;
  let effects: TechniciansEffects;
  let technicianMockService: jasmine.SpyObj<TechnicianService>;

  beforeEach(() => {
    technicianMockService = jasmine.createSpyObj<TechnicianService>(['getAll', 'deleteTechnician']);

    TestBed.configureTestingModule({
      providers: [
        TechniciansEffects,
        provideMockActions(() => actions$),
        {
          provide: TechnicianService,
          useValue: technicianMockService,
        },
      ],
    });

    effects = TestBed.get<TechniciansEffects>(TechniciansEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadTechnicians$', () => {
    it('should call technician service', () => {
      technicianMockService.getAll.and.returnValue(of([]));
      actions$ = hot('--a-', {
        a: loadTechnicians(),
      });
      const expected = cold('--b', {
        b: loadTechniciansSuccess({data: []}),
      });
      expect(effects.loadTechnicians$).toBeObservable(expected);
      expect(technicianMockService.getAll).toHaveBeenCalled();
    });

    it('should trigger error report on failure', () => {
      const errorMessage = 'ERROR_MESSAGE';
      technicianMockService.getAll.and.returnValue(throwError({
        message: errorMessage,
      }));
      actions$ = hot('--a-', {
        a: loadTechnicians(),
      });
      const expected = cold('--b', {
        b: ReportingActions.reportError({message: errorMessage}),
      });
      expect(effects.loadTechnicians$).toBeObservable(expected);
    });
  });

  describe('deleteTechnician$', () => {
    it('should delete technician and report success', () => {
      technicianMockService.deleteTechnician.withArgs(exampleTechnician()).and.returnValue(of(undefined));
      actions$ = hot('--a-', {
        a: deleteTechnician({technician: exampleTechnician()}),
      });
      const expected = cold('--(bc)', {
        b: deleteTechnicianSuccess({technician: exampleTechnician()}),
        c: ReportingActions.reportSuccess({message: 'DASHBOARD_TECHNICIAN_HAS_BEEN_DELETED'}),
      });

      expect(effects.deleteTechnician$).toBeObservable(expected);
    });
  });
});

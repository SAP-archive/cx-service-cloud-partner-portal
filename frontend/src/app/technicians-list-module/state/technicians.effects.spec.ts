import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import * as ReportingActions from '../../state/reporting/reporting.actions';
import { TechniciansEffects } from './technicians.effects';
import { TechnicianService } from '../services/technicians.service';
import { cold, hot } from 'jasmine-marbles';
import { loadTechnicians, loadTechniciansSuccess, searchTechnicians, searchTechniciansSuccess } from './technicians.actions';

describe('TechniciansEffects', () => {
  let actions$: Observable<any>;
  let effects: TechniciansEffects;
  let technicianMockService: jasmine.SpyObj<TechnicianService>;

  beforeEach(() => {
    technicianMockService = jasmine.createSpyObj<TechnicianService>(['loadTechnicians', 'searchTechnicians']);

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

    effects = TestBed.inject<TechniciansEffects>(TechniciansEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadTechnicians$', () => {
    it('should call technician service', () => {
      technicianMockService.loadTechnicians.and.returnValue(of({results: []}));
      actions$ = hot('--a-', {
        a: loadTechnicians(),
      });
      const expected = cold('--b', {
        b: loadTechniciansSuccess({results: []}),
      });
      expect(effects.loadTechnicians$).toBeObservable(expected);
      expect(technicianMockService.loadTechnicians).toHaveBeenCalled();
    });

    it('should trigger error report on failure', () => {
      const errorMessage = 'ERROR_MESSAGE';
      technicianMockService.loadTechnicians.and.returnValue(throwError({
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

  describe('searchTechnicians$', () => {
    it('should call technician service', () => {
      technicianMockService.searchTechnicians.and.returnValue(of({results: []}));
      actions$ = hot('--a-', {
        a: searchTechnicians({name: 'name'}),
      });
      const expected = cold('--b', {
        b: searchTechniciansSuccess({results: []}),
      });
      expect(effects.searchTechnicians$).toBeObservable(expected);
      expect(technicianMockService.searchTechnicians).toHaveBeenCalled();
    });

    it('should trigger error report on failure', () => {
      const errorMessage = 'ERROR_MESSAGE';
      technicianMockService.searchTechnicians.and.returnValue(throwError({
        message: errorMessage,
      }));
      actions$ = hot('--a-', {
        a: searchTechnicians({name: 'name'}),
      });
      const expected = cold('--b', {
        b: ReportingActions.reportError({message: errorMessage}),
      });
      expect(effects.searchTechnicians$).toBeObservable(expected);
    });
  });
});

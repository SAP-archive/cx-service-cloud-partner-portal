import { ReportingEffects } from './reporting.effects';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { LocalisationService } from 'src/app/services/localisation.service';
import { provideMockActions } from '@ngrx/effects/testing';
import * as ReportingActions from './reporting.actions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class LocalizationServiceMock {
  public translate(key: string): Observable<string> {
    return of(`translation of ${key}`);
  }
}

describe('ReportingEffects', () => {
  let localizationServiceMock: LocalizationServiceMock;
  let effects: ReportingEffects;
  let actions$: Observable<any>;

  beforeEach(() => {
    localizationServiceMock = new LocalizationServiceMock();
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [
        ReportingEffects,
        provideMockActions(() => actions$),
        {
          provide: LocalisationService,
          useValue: localizationServiceMock,
        },
      ],
    });
    effects = TestBed.inject(ReportingEffects);
  });

  describe('report', () => {
    it('should translate message', (done) => {
      const localizationService = TestBed.inject(LocalisationService);
      const spy = spyOn(localizationService, 'translate').and.returnValue(of(''));
      actions$ = of(ReportingActions.reportSuccess({ message: 'message' }));
      effects.report.subscribe(message => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    it('should open snack bar', (done) => {
      const snackBar = TestBed.inject(MatSnackBar);
      const spy = spyOn(snackBar, 'open');
      actions$ = of(ReportingActions.reportSuccess({ message: 'message' }));
      effects.report.subscribe(message => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    it('should set panel class with severity warning', (done) => {
      const snackBar = TestBed.inject(MatSnackBar);
      const spy = spyOn(snackBar, 'open');
      actions$ = of(ReportingActions.reportWarning({ message: 'message' }));
      effects.report.subscribe(message => {
        expect(spy).toHaveBeenCalledWith('translation of message', null, { panelClass: 'warning-snackbar' });
        done();
      });
    });

    it('should set duration with duration', (done) => {
      const snackBar = TestBed.inject(MatSnackBar);
      const spy = spyOn(snackBar, 'open');
      actions$ = of(ReportingActions.reportSuccess({ message: 'message' }));
      effects.report.subscribe(message => {
        expect(spy).toHaveBeenCalledWith('translation of message', null, { duration: 10000 });
        done();
      });
    });
  });
});

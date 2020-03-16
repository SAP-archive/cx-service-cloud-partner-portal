import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { RecursivePartial } from '../../utils/recursive-partial';
import { ReportingFacade, State, initialState } from './reporting.facade';
import * as ReportingActions from './reporting.actions';

describe('ConfigFacade', () => {
  type MockedState = RecursivePartial<{ config: State }>;
  let store: MockStore<MockedState>;
  let facade: ReportingFacade;

  const getState = (configState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportingFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.get(Store);
    facade = TestBed.get(ReportingFacade);
  });

  describe('reportError()', () => {
    it('should dispatch ReportingActions.reportError action', () => {
      const spy = spyOn(store, 'dispatch');
      const message = 'some error';
      facade.reportError(message);
      expect(spy).toHaveBeenCalledWith(ReportingActions.reportError({message}));
    });
  });
});

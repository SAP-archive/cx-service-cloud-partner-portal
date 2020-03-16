import { ConfigFacade } from './config.facade';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../utils/recursive-partial';
import { initialState, State } from './config.reducer';

describe('ConfigFacade', () => {
  type MockedState = RecursivePartial<{ config: State }>;
  let store: MockStore<MockedState>;
  let facade: ConfigFacade;

  const getState = (configState: RecursivePartial<State> = initialState): RecursivePartial<MockedState> => ({
    config: configState,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigFacade,
        provideMockStore({
          initialState: getState(),
        }),
      ],
    });

    store = TestBed.get(Store);
    facade = TestBed.get(ConfigFacade);
  });

  describe('appConfig', () => {
    it('should select appConfig from state', () => {
      expect(facade.appConfig).toBeObservable(cold('a', {a: initialState.appConfig}));
    });
  });

  describe('embeddedConfig', () => {
    it('should select embeddedConfig from state', () => {
      expect(facade.embeddedConfig).toBeObservable(cold('a', {a: initialState.embeddedConfig}));
    });
  });
});

import { ConfigFacade } from './config.facade';
import { MockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { RecursivePartial } from '../../utils/recursive-partial';
import { initialState, reducer, State } from './config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ConfigEffects } from './config.effects';
import { CompanySettingsService } from '../../services/company-settings.service';
import { marbles } from 'rxjs-marbles/jasmine';
import { exampleCompanySettings } from '../../model/company-settings';
import { of } from 'rxjs';

describe('ConfigFacade', () => {
  type MockedState = RecursivePartial<{ config: State }>;
  let store: MockStore<MockedState>;
  let facade: ConfigFacade;
  let companySettingsServiceMock: jasmine.SpyObj<CompanySettingsService>;

  beforeEach(() => {
    companySettingsServiceMock = jasmine.createSpyObj<CompanySettingsService>(['fetch']);
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          config: reducer,
        }),
        EffectsModule.forRoot([ConfigEffects]),
      ],
      providers: [
        ConfigFacade,
        {
          provide: CompanySettingsService,
          useValue: companySettingsServiceMock,
        },
      ],
    });

    store = TestBed.inject(Store) as MockStore<MockedState>;
    facade = TestBed.inject(ConfigFacade);
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

  describe('fetchCompanySettingsIfNotLoadedYet()', () => {
    it('should update company settings with fetched data', marbles(m => {
      companySettingsServiceMock.fetch.and.returnValue(m.cold('-a|', {
        a: exampleCompanySettings(),
      }));

      facade.fetchCompanySettingsIfNotLoadedYet();

      m.expect(facade.allowAssignmentHandover).toBeObservable('t', {
        t: true,
      });

      m.expect(facade.allowAssignmentReject).toBeObservable('tf', {
        f: false,
        t: true,
      });

      m.expect(facade.allowAssignmentClose).toBeObservable('t', {
        t: true,
      });
    }));

    it('should not fetch company settings if already loaded', marbles(m => {
      facade.selectAreCompanySettingsLoaded = of(true);
      facade.fetchCompanySettingsIfNotLoadedYet();

      expect(companySettingsServiceMock.fetch).not.toHaveBeenCalled();
    }));
  });
});

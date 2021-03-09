import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PartnerPortalComponent } from './partner-portal.component';
import { FormsModule } from '@angular/forms';
import { LocalisationSelectorComponent } from '../localisation-selector/localisation-selector.component';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import * as fromConfig from '../../state/config/config.reducer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { initLocalisation } from '../../state/user/user.actions';
import { translateModule } from '../../utils/translate.module';
import { HttpClientModule } from '@angular/common/http';
import { LaunchDarklyClientService } from '../../services/launch-darkly-client.service';
import { ConfigFacade } from '../../state/config/config.facade';
import { of } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

describe('PartnerPortalComponent', () => {
  let storeMock,
    launchDarklyServiceMock,
    configFacadeMock;

  beforeEach(async(() => {
    storeMock = cold('-a-b-', {
      a: {partnerForm: {isSaving: false}, config: fromConfig.initialState},
      b: {partnerForm: {isSaving: true}, config: fromConfig.initialState},
    });
    launchDarklyServiceMock = createSpyObj('LaunchDarklyService', {
      initialize: undefined,
      canAccess: Promise.resolve(true),
    });
    configFacadeMock = {
      embeddedConfig: of(fromConfig.initialState.embeddedConfig),
      fetchCompanySettings: jasmine.createSpy(),
    };
    storeMock.dispatch = () => null;
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        translateModule,
        HttpClientModule,
      ],
      declarations: [
        PartnerPortalComponent,
        LocalisationSelectorComponent,
      ],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
        {
          provide: LaunchDarklyClientService,
          useValue: launchDarklyServiceMock,
        },
        {
          provide: ConfigFacade,
          useValue: configFacadeMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PartnerPortalComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have router outlet', () => {
    const fixture = TestBed.createComponent<PartnerPortalComponent>(PartnerPortalComponent);
    const element: HTMLElement = fixture.debugElement.nativeElement;

    expect(element.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have localisation selector', () => {
    const fixture = TestBed.createComponent<PartnerPortalComponent>(PartnerPortalComponent);
    const element: HTMLElement = fixture.debugElement.nativeElement;

    expect(element.querySelector('pp-localisation-selector')).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should init localisation', () => {
      const spy = spyOn(storeMock, 'dispatch');
      const fixture = TestBed.createComponent(PartnerPortalComponent);
      fixture.componentInstance.ngOnInit();
      expect(spy).toHaveBeenCalledWith(initLocalisation());
    });

    it('should init Launch Darkly service', () => {
      const fixture = TestBed.createComponent(PartnerPortalComponent);
      fixture.componentInstance.ngOnInit();
      expect(launchDarklyServiceMock.initialize).toHaveBeenCalledWith(
        fromConfig.initialState.embeddedConfig.launchdarklyKey,
        'partner-portal',
        false,
      );
    });
  });
});

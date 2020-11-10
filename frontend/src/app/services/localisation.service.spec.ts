import { LocalisationService } from './localisation.service';
import { of } from 'rxjs';
import { exampleLocalisation, Localisation } from '../components/localisation-selector/localisation';
import { cold } from 'jasmine-marbles';
import { HttpResponse } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;

describe('LocalisationService', () => {
  let translateService: any;
  let appBackendService: any;
  let authFacade: any;
  let userFacade: any;
  let localisationService: LocalisationService;

  beforeEach(() => {
    translateService = createSpyObj(['setDefaultLang', 'getBrowserLang', 'use', 'get']);
    appBackendService = createSpyObj(['post']);
    userFacade = createSpyObj([
      'currentLocalisation',
      'isLocalisationChangeNeeded',
      'setIsLocalisationChangeNeeded',
      'setCurrentLocalisation']);
    authFacade = createSpyObj(['isLoggedIn']);
    localisationService = new LocalisationService(translateService, appBackendService, authFacade, userFacade);
  });

  describe('getInitialLocalisation()', () => {
    describe('if localisation is not set in local storage', () => {
      it('should guess the localisation from the browser', () => {
        const browserLocalisation = (): Localisation => ({
          code: 'pl',
          language: 'pl',
          name: 'Polish',
        });
        translateService.getBrowserLang.and.returnValue(browserLocalisation().code);
        localisationService.localisation = null;
        const result = localisationService.getInitialLocalisation();
        expect(result).toEqual(browserLocalisation());
      });
    });

    describe('if localisation is set in local storage', () => {
      it('should take value from local storage', () => {
        localisationService.localisation = exampleLocalisation();
        const result = localisationService.getInitialLocalisation();
        expect(result).toEqual(exampleLocalisation());
      });
    });
  });

  describe('translate()', () => {
    it('should translate using the underlying service', () => {
      translateService.get.and.returnValue(of('translated'));
      localisationService.translate('key').subscribe(translated => {
        expect(translateService.get).toHaveBeenCalledWith('key');
        expect(translated).toEqual('translated');
      });
    });
  });

  describe('selectLocalisation', () => {
    it('should set localisation on application backend and in local service', () => {
      appBackendService.post.withArgs('/setLocalisation', {
        code: exampleLocalisation().code,
        language: exampleLocalisation().language,
      }).and.returnValue(cold('a|', {a: new HttpResponse({body: []})}));
      authFacade.isLoggedIn = of(true);
      const response = localisationService.selectLocalisation(exampleLocalisation());
      expect(response).toBeObservable(cold('a|', {a: []}));
      expect(translateService.use).toHaveBeenCalledWith(exampleLocalisation().language);
    });

    describe('if is logged out', () => {
      it('should set localisation in local service', () => {
        const responseObservable = () => cold('(a|)', {a: []});
        authFacade.isLoggedIn = of(false);
        const response = localisationService.selectLocalisation(exampleLocalisation());

        expect(response).toBeObservable(responseObservable());
        expect(userFacade.setIsLocalisationChangeNeeded).toHaveBeenCalledWith(true);
        expect(translateService.use).toHaveBeenCalledWith(exampleLocalisation().language);
      });
    });

    describe('if localisation is undefined', () => {
      it('should exit immediately', () => {
        const response = localisationService.selectLocalisation(undefined);
        expect(response).toBeObservable(cold('(a|)', {a: []}));
      });
    });
  });

  describe('setLocalisationWhenLoginSuccess', () => {
    it('should send request to change localisation', () => {
      appBackendService.post.withArgs('/setLocalisation', {
        code: exampleLocalisation().code,
        language: exampleLocalisation().language,
      }).and.returnValue(cold('a|', {a: new HttpResponse({body: []})}));
      userFacade.currentLocalisation = of(exampleLocalisation());
      userFacade.isLocalisationChangeNeeded = of(true);
      const response = localisationService.setLocalisationWhenLoginSuccess(exampleLocalisation());
      expect(response).toBeObservable(cold('a|', {a: []}));
      expect(userFacade.setIsLocalisationChangeNeeded).toHaveBeenCalledWith(false);
    });

    describe('needChange is false', () => {
      it('Only set localisation in local service', () => {
        const responseObservable = () => cold('(a|)', {a: []});
        userFacade.currentLocalisation = of(exampleLocalisation());
        userFacade.isLocalisationChangeNeeded = of(false);
        const response = localisationService.setLocalisationWhenLoginSuccess(exampleLocalisation());
        expect(response).toBeObservable(responseObservable());
        expect(userFacade.setCurrentLocalisation).toHaveBeenCalledWith(exampleLocalisation());
        expect(translateService.use).toHaveBeenCalledWith(exampleLocalisation().language);
      });
    });

    describe('if localisation is undefined', () => {
      it('should exit immediately', () => {
        const response = localisationService.setLocalisationWhenLoginSuccess(undefined);
        expect(response).toBeObservable(cold('(a|)', {a: []}));
      });
    });
  });

  describe('setLocalLocalisation', () => {
    it('should exit immediately', () => {
      const response = localisationService.setLocalLocalisation(exampleLocalisation());
      expect(response).toBeObservable(cold('(a|)', {a: []}));
      expect(translateService.use).toHaveBeenCalledWith(exampleLocalisation().language);
    });
  });

});

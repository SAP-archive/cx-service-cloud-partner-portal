import { LocalisationService } from './localisation.service';
import { of } from 'rxjs';
import { exampleLocalisation, Localisation } from '../components/localisation-selector/localisation';
import { cold } from 'jasmine-marbles';
import { HttpResponse } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;

describe('LocalisationService', () => {
  describe('getInitialLocalisation()', () => {
    describe('if localisation is not set in local storage', () => {
      it('should guess the localisation from the browser', () => {
        const translateServiceMock = createSpyObj(['setDefaultLang', 'getBrowserLang']);
        const browserLocalisation = (): Localisation => ({
          code: 'pl',
          language: 'pl',
          name: 'Polish',
        });
        translateServiceMock.getBrowserLang.and.returnValue(browserLocalisation().code);
        const localisationService = new LocalisationService(null, translateServiceMock, null, null);

        localisationService.localisation = null;
        const result = localisationService.getInitialLocalisation();
        expect(result).toEqual(browserLocalisation());
      });
    });

    describe('if localisation is set in local storage', () => {
      it('should take value from local storage', () => {
        const translateServiceMock = createSpyObj(['setDefaultLang']);
        const localisationService = new LocalisationService(null, translateServiceMock, null, null);
        localisationService.localisation = exampleLocalisation();

        const result = localisationService.getInitialLocalisation();

        expect(result).toEqual(exampleLocalisation());
      });
    });
  });

  describe('translate()', () => {
    it('should translate using the underlying service', () => {
      const translateServiceMock = createSpyObj(['setDefaultLang', 'get']);
      translateServiceMock.get.and.returnValue(of('translated'));
      const localisationService = new LocalisationService(null, translateServiceMock, null, null);
      localisationService.translate('key').subscribe(translated => {
        expect(translateServiceMock.get).toHaveBeenCalledWith('key');
        expect(translated).toEqual('translated');
      });
    });
  });

  describe('setLocalisation', () => {
    it('should set localisation on application backend and in local service', () => {
      const appBackendService = jasmine.createSpyObj(['post']);
      appBackendService.post.withArgs('/setLocalisation', {
        code: exampleLocalisation().code,
        language: exampleLocalisation().language,
      })
        .and
        .returnValue(cold('a|', {a: new HttpResponse({body: []})}));
      const translateServiceMock = createSpyObj(['use', 'setDefaultLang']);
      const authFacade = {isLoggedIn: of(true)};
      const localisationService = new LocalisationService(null, translateServiceMock, appBackendService, authFacade as any);

      const response = localisationService.setLocalisation(exampleLocalisation());

      expect(response).toBeObservable(cold('a|', {a: []}));
      expect(translateServiceMock.use).toHaveBeenCalledWith(exampleLocalisation().language);
    });

    describe('if is logged out', () => {
      it('should set localisation in local service', () => {
        const responseObservable = () => cold('(a|)', {a: []});
        const translateServiceMock = createSpyObj(['use', 'setDefaultLang']);
        const authFacade = {isLoggedIn: of(false)};
        const localisationService = new LocalisationService(null, translateServiceMock, null, authFacade as any);

        const response = localisationService.setLocalisation(exampleLocalisation());

        expect(response).toBeObservable(responseObservable());
        expect(translateServiceMock.use).toHaveBeenCalledWith(exampleLocalisation().language);
      });
    });

    describe('if localisation is undefined', () => {
      it('should exit immediately', () => {
        const translateServiceMock = createSpyObj(['use', 'setDefaultLang']);
        const localisationService = new LocalisationService(null, translateServiceMock, null, null);
        const response = localisationService.setLocalisation(undefined);

        expect(response).toBeObservable(cold('(a|)', {a: []}));
      });
    });
  });
});

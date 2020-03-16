import { CompanyProfileEditorComponent } from './company-profile-editor.component';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { exampleCompanyDetails } from '../../model/company-profile.model';
import { CompanyProfileFacade } from '../../state/company-profile.facade';
import { cold } from 'jasmine-marbles';
import { CompanyProfileFacadeMockBuilder } from '../../state/company-profile-facade.mock.spec';
import { extractPropertiesBasedOnOtherObject } from '../../../utils/extract';
import { omit } from '../../../utils/omit';
import { exampleSaveCompanyProfileData } from '../../model/save-company-profile-data';
import { RemovedDocumentsFacade } from '../../state/removed-documents/removed-documents.facade';
import { RemovedDocumentsFacadeMockBuilder } from '../../state/removed-documents/removed-documents-facade.mock.spec';
import { NewDocumentsFacade } from '../../state/new-documents/new-documents.facade';
import { NewDocumentsFacadeMockBuilder } from '../../state/new-documents/new-documents-facade.mock.spec';
import { emptyServiceArea, exampleServiceArea } from '../../../model/service-area.model';
import { emptyContact, exampleContact } from '../../model/contact.model';
import { emptyAddress, exampleAddress } from '../../model/address.model';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('CompanyProfileEditorComponent', () => {
  const componentFactory = (
    companyProfileFacadeMock: SpyObj<CompanyProfileFacade>,
    newDocumentsFacadeMock?: SpyObj<NewDocumentsFacade>,
    removedDocumentsFacadeMock?: SpyObj<RemovedDocumentsFacade>,
    dialog?: SpyObj<MatDialog>,
  ) =>
    new CompanyProfileEditorComponent(
      companyProfileFacadeMock,
      newDocumentsFacadeMock,
      removedDocumentsFacadeMock,
      new FormBuilder(),
      dialog,
    );

  it('should share a name observable from company profile facade', () => {
    const nameObservable = () => cold('a', {a: 'Serious Business and Partners'});
    const component = componentFactory(new CompanyProfileFacadeMockBuilder().setName(nameObservable()).build());

    expect(component.name).toBeObservable(nameObservable());
  });

  it('should share isSaving observable from company profile facade', () => {
    const isSavingObservable = () => cold('a-b', {a: true, b: false});
    const component = componentFactory(new CompanyProfileFacadeMockBuilder().setIsSaving(isSavingObservable()).build());

    expect(component.isSaving).toBeObservable(isSavingObservable());
  });

  it('should share isSaving observable from company profile facade', () => {
    const isSavingObservable = () => cold('a-b', {a: true, b: false});
    const component = componentFactory(new CompanyProfileFacadeMockBuilder().setIsSaving(isSavingObservable()).build());

    expect(component.saveButtonLabel).toBeObservable(cold('a-b', {a: 'SAVING', b: 'SAVE'}));
  });

  describe('ngOnInit()', () => {
    it('should fill the form with data from company profile facade', () => {
      const companyDetails = {
        ...exampleCompanyDetails(),
        contact: {
          ...exampleContact(),
          newUnhandledPropertyFromBackend: 'value',
        },
        address: {
          ...exampleAddress(),
          newUnhandledPropertyFromBackend: 'value',
        },
        serviceArea: {
          ...exampleServiceArea(),
          newUnhandledPropertyFromBackend: 'value',
        },
      };
      const component = componentFactory(new CompanyProfileFacadeMockBuilder().setCompanyDetails(of(companyDetails)).build());

      component.ngOnInit();

      expect(component.profileForm.getRawValue()).toEqual({
        contact: omit(extractPropertiesBasedOnOtherObject(
          exampleCompanyDetails().contact,
          emptyContact(),
          ),
          'role', 'id', 'syncStatus',
        ),
        address: omit(
          extractPropertiesBasedOnOtherObject(
            exampleCompanyDetails().address,
            emptyAddress(),
          ),
          'id', 'syncStatus',
        ),
        serviceArea: extractPropertiesBasedOnOtherObject(
          exampleCompanyDetails().serviceArea,
          emptyServiceArea(),
        ),
        name: exampleCompanyDetails().name
      });
    });
  });

  describe('onSubmit()', () => {
    it('should save profile with data from the form and new documents facade', () => {
      const facade = new CompanyProfileFacadeMockBuilder().build();
      const newDocumentsFacade = new NewDocumentsFacadeMockBuilder().build();
      const removedDocumentsFacade = new RemovedDocumentsFacadeMockBuilder().build();
      const component = componentFactory(facade, newDocumentsFacade, removedDocumentsFacade);

      component.ngOnInit();
      component.onSubmit();

      expect(facade.saveCompanyProfile).toHaveBeenCalledWith(exampleSaveCompanyProfileData());
    });
  });

  describe('service area field', () => {
    it('should have serviceAreaFormValidator validator', () => {
      const component = componentFactory(new CompanyProfileFacadeMockBuilder().build());
      const field = component.profileForm.get('serviceArea');

      field.setValue(exampleServiceArea());
      expect(field.hasError('serviceAreaIsNotValid')).toBeFalse();

      field.setValue({...exampleServiceArea(), googlePlaceId: ''});
      expect(field.hasError('serviceAreaIsNotValid')).toBeFalse();

      field.setValue({...exampleServiceArea(), radius: {value: NaN, unit: 'mi'}});
      expect(field.hasError('serviceAreaIsNotValid')).toBeTrue();
    });
  });
});

import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CompanyProfileFacade } from '../../state/company-profile.facade';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CompanyDetails } from '../../model/company-profile.model';
import { RecursivePartial } from '../../../utils/recursive-partial';
import { extractPropertiesBasedOnOtherObject } from '../../../utils/extract';
import { omit } from '../../../utils/omit';
import { NewDocumentsFacade } from '../../state/new-documents/new-documents.facade';
import { RemovedDocumentsFacade } from '../../state/removed-documents/removed-documents.facade';
import { emptyServiceArea } from '../../../model/service-area.model';
import { serviceAreaFormValidator } from '../../../service-area-module/validators/service-area-form.validator';
import { emptyContact } from '../../model/contact.model';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedConfirmationDialogComponent } from '../../../components/unsaved-confirmation-dialog/unsaved-confirmation-dialog.component';
import { emptyAddress } from '../../model/address.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportingFacade } from 'src/app/state/reporting/reporting.facade';

@Component({
  selector: 'pp-company-profile-editor',
  templateUrl: './company-profile-editor.component.html',
  styleUrls: ['./company-profile-editor.component.scss'],
})
export class CompanyProfileEditorComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event'])
  private beforeunload(event: Event) {
    if (this.profileForm.dirty) {
      event.returnValue = true;
    }
  }

  public name = this.companyProfileFacade.name;
  public isSaving = this.companyProfileFacade.isSaving;
  public isLoading = this.companyProfileFacade.isLoading;
  public saveButtonLabel = this.isSaving.pipe(map(isSaving => isSaving ? 'SAVING' : 'SAVE'));
  public profileForm: FormGroup = this.formBuilder.group(
    {
      name: '',
      contact: this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        emailAddress: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
      }),
      address: this.formBuilder.group({
        city: [''],
        country: [''],
        number: [''],
        streetName: [''],
        zipCode: [''],
      }),
      serviceArea: this.formBuilder.control(emptyServiceArea(), serviceAreaFormValidator),
    },
  );
  public companyDetails: CompanyDetails;
  private destroyed$: Subject<undefined> = new Subject();
  public isBlocked: boolean;

  constructor(
    private companyProfileFacade: CompanyProfileFacade,
    private newDocumentsFacade: NewDocumentsFacade,
    private removedDocumentsFacade: RemovedDocumentsFacade,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private reportingFacade: ReportingFacade,
  ) {
  }

  public ngOnInit(): void {
    this.companyProfileFacade.companyDetails
      .pipe(takeUntil(this.destroyed$))
      .subscribe(companyDetails => {
        this.companyDetails = companyDetails;
        this.profileForm.setValue(this.companyDetailsToFormData(companyDetails));
        this.profileForm.markAsPristine();

        this.isBlocked = this.isProfileBlockedBySyncStatus();
        if (this.isBlocked) {
          this.reportingFacade.reportWarning('COMPANY_PROFILE_UPDATE_BLOCKED');
        }
      });
  }

  private isProfileBlockedBySyncStatus(): boolean {
    const BLOCKED_STATUS = 'BLOCKED';
    return (this.companyDetails.syncStatus === BLOCKED_STATUS) ||
      (this.companyDetails.address && this.companyDetails.address.syncStatus === BLOCKED_STATUS) ||
      (this.companyDetails.contact && this.companyDetails.contact.syncStatus === BLOCKED_STATUS);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.snackBar.dismiss();
  }

  public onSubmit(): void {
    const formData: RecursivePartial<CompanyDetails> = this.profileForm.getRawValue();

    combineLatest(
      this.newDocumentsFacade.newDocuments,
      this.removedDocumentsFacade.removedDocumentsIds,
    )
      .pipe(take(1))
      .subscribe(([newDocuments, removedDocumentsIds]) =>
        this.companyProfileFacade.saveCompanyProfile({
          companyDetails: {
            ...this.companyDetails,
            address: {
              ...this.companyDetails.address,
              ...formData.address,
            },
            contact: {
              ...this.companyDetails.contact,
              ...formData.contact,
            },
            serviceArea: {
              ...this.companyDetails.serviceArea,
              ...formData.serviceArea,
            },
            name: formData.name
          },
          newDocuments,
          removedDocumentsIds,
        }),
      );
  }

  private companyDetailsToFormData(details: CompanyDetails): RecursivePartial<CompanyDetails> {
    return {
      contact: omit(extractPropertiesBasedOnOtherObject(details.contact, emptyContact()), 'id', 'role', 'syncStatus'),
      address: omit(extractPropertiesBasedOnOtherObject(details.address, emptyAddress()), 'id', 'syncStatus'),
      name: details.name,
      serviceArea: extractPropertiesBasedOnOtherObject(details.serviceArea, emptyServiceArea()),
    };
  }

  public onPageLeaving(): Observable<boolean> {
    if (this.profileForm && this.profileForm.dirty) {
      return this.dialog.open(UnsavedConfirmationDialogComponent).afterClosed();
    } else {
      return of(true);
    }
  }

  public onDocsListChange() {
    this.profileForm.markAsDirty();
  }
}

import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TechnicianProfileFacade } from '../../state/technician-profile.facade';
import { Observable, Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TechnicianProfile } from '../../models/technician-profile.model';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedConfirmationDialogComponent } from '../../../components/unsaved-confirmation-dialog/unsaved-confirmation-dialog.component';

interface FormDataStructure {
  contact: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
  };
  address: {
    streetName: string;
    houseNumber: string;
    zipCode: string;
    country: string;
    city: string;
  };
}

export type WorkingMode = 'EDIT' | 'CREATE';

@Component({
  selector: 'pp-technician-details-editor',
  templateUrl: './technician-details-editor.component.html',
  styleUrls: ['./technician-details-editor.component.scss'],
})
export class TechnicianDetailsEditorComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event'])
  private beforeunload(event: Event) {
    if (this.profileForm.dirty) {
      event.returnValue = true;
    }
  }
  public isLoading: Observable<boolean> = this.profileFacade.isLoading;
  private isWaitingNavigate: boolean;
  public technicianProfile: TechnicianProfile;
  public profileForm: FormGroup = this.formBuilder.group({
    contact: this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
    }),
    address: this.formBuilder.group({
      streetName: ['', [Validators.required]],
      houseNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
    }),
  });
  private destroyed = new Subject<void>();
  private editorMode: WorkingMode;

  constructor(
    private formBuilder: FormBuilder,
    private profileFacade: TechnicianProfileFacade,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.editorMode = route.snapshot.data.mode;
  }

  public async onSubmit() {
    return this.mapFormToTechnicianData().then(profile => {
      if (this.editorMode === 'EDIT') {
        return this.profileFacade.saveProfile(profile);
      } else if (this.editorMode === 'CREATE') {
        return this.profileFacade.createProfile(profile);
      }
    });
  }

  public getFullName(): string {
    const { firstName, lastName } = this.technicianProfile;

    if (!firstName && !lastName) {
      return 'Unnamed';
    }

    return `${firstName} ${lastName}`;
  }

  public ngOnInit() {
    if (this.editorMode === 'EDIT') {
      this.profileFacade.fetchTechnicianProfile(this.getTechnicianId());
    }

    this.profileFacade.fetchTags();
    this.profileFacade.technicianProfile
      .pipe(takeUntil(this.destroyed))
      .subscribe(technician => {
        this.profileForm.patchValue(this.mapTechnicianToFormData(technician));
        this.profileForm.markAsPristine();
        this.technicianProfile = technician;
      });
    this.profileFacade.skillsEdited.pipe(
      takeUntil(this.destroyed),
      map(() => this.profileForm.markAsDirty()))
      .subscribe();
    this.profileFacade.isWaitingNavigate.subscribe((navigate: boolean) => this.isWaitingNavigate = navigate);
  }

  public ngOnDestroy() {
    this.profileFacade.clearProfileData();
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getTechnicianId(): string {
    return this.route.snapshot.params.technicianId;
  }

  private mapTechnicianToFormData(technician: TechnicianProfile) {
    const { address } = technician;
    return {
      contact: {
        firstName: technician.firstName,
        lastName: technician.lastName,
        emailAddress: technician.email,
        phoneNumber: technician.mobilePhone,
      },
      address: !!address
        ? {
          streetName: address.streetName,
          houseNumber: address.number,
          zipCode: address.zipCode,
          city: address.city,
          country: address.country,
        }
        : {
          streetName: '',
          houseNumber: '',
          zipCode: '',
          city: '',
          country: '',
        },
    };
  }

  private mapFormToTechnicianData(): Promise<Partial<TechnicianProfile>> {
    const formData: FormDataStructure = this.profileForm.getRawValue();
    return this.profileFacade.technicianAddress.pipe(
      take(1),
      map(address => ({
        externalId: this.getTechnicianId(),
        lastName: formData.contact.lastName,
        firstName: formData.contact.firstName,
        email: formData.contact.emailAddress,
        mobilePhone: formData.contact.phoneNumber,
        address: {
          id: !!address ? address.id : undefined,
          city: formData.address.city,
          country: formData.address.country,
          number: formData.address.houseNumber,
          streetName: formData.address.streetName,
          zipCode: formData.address.zipCode,
        },
      }))).toPromise();
  }

  public onPageLeaving(): Observable<boolean> {
    if ((this.editorMode === 'CREATE' && this.isWaitingNavigate) || this.profileForm.pristine) {
      return of(true);
    } else {
      return this.dialog.open(UnsavedConfirmationDialogComponent).afterClosed();
    }
  }
}

import { Subject } from 'rxjs';
import * as fromTechnicianProfile from './technician-profile.selectors';
import * as profileActions from './technician-profile.actions';
import { State } from './technician-profile.reducer';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { TechnicianProfile } from '../models/technician-profile.model';
import { filter, map, take } from 'rxjs/operators';
import { Skill, SkillWithViewModelId } from '../models/skill.model';
import { NewCertificateWithViewModelId, NewSkillCertificate } from '../models/skill-certificate.model';
import { SkillViewModel } from '../models/skill-view.model';

@Injectable({
  providedIn: 'root',
})
export class TechnicianProfileFacade {
  public skillsEdited = new Subject<void>();
  public isLoading = this.store.select(fromTechnicianProfile.selectIsLoading);
  public skillViewModels = this.store.select(fromTechnicianProfile.selectSkillViewModels);
  public isAwaitingNavigationChange = this.store.select(fromTechnicianProfile.selectIsAwaitingNavigationChange);
  public technicianProfile = this.store.select(fromTechnicianProfile.selectProfileData)
    .pipe(filter(profile => !!profile));
  public technicianAddress = this.store.select(fromTechnicianProfile.selectProfileData).pipe(
    filter(profile => !!profile),
    map(profile => profile.address));

  constructor(
    private store: Store<State>,
  ) {
  }

  public addSkill({id}: SkillViewModel) {
    this.store.dispatch(profileActions.addSkillToProfile({skillViewModelId: id}));
    this.skillsEdited.next();
  }

  public removeSkill({id}: SkillViewModel) {
    this.store.dispatch(profileActions.removeSkillFromProfile({skillViewModelId: id}));
    this.skillsEdited.next();
  }

  public fetchTags(): void {
    this.store.dispatch(profileActions.loadTags());
  }

  public fetchTechnicianProfile(technicianId: string): void {
    this.store.dispatch(profileActions.loadTechnicianProfile({technicianId}));
    this.store.dispatch(profileActions.loadSkills({technicianExternalId: technicianId}));
  }

  public saveProfile(profile: Partial<TechnicianProfile>) {
    this.skillViewModels
      .pipe(take(1))
      .subscribe((skillViewModels) => {
        this.store.dispatch(profileActions.saveTechnicianProfile({
          profile,
          skills: {
            add: this.getSkillsToAdd(skillViewModels, profile.externalId),
            remove: this.getSkillsToRemove(skillViewModels),
          },
          certificates: {
            add: this.getCertificatesToAdd(skillViewModels),
            remove: this.getSkillIdsToRemoveCertificatesFrom(skillViewModels),
          },
        }));
      });
  }

  public downloadCertificate(skill: Skill) {
    this.technicianProfile.pipe(take(1)).subscribe(profile =>
      this.store.dispatch(profileActions.downloadCertificate({
        technicianId: profile.externalId,
        skill,
      })));
  }

  public createProfile(profile: Partial<TechnicianProfile>) {
    this.skillViewModels
      .pipe(take(1))
      .subscribe((skillViewModels) => {
        this.store.dispatch(profileActions.createTechnicianProfile({
          profile,
          skills: this.getSkillsToAdd(skillViewModels, profile.externalId),
          certificates: this.getCertificatesToAdd(skillViewModels),
        }));
      });
  }

  public deleteProfile(technicianId: TechnicianProfile['externalId']) {
    this.store.dispatch(profileActions.deleteTechnicianProfile({technicianId}));
  }

  public removeCertificateUpload(skillViewModelId: string) {
    this.store.dispatch(profileActions.removeCertificateUpload({skillViewModelId}));
  }

  public deleteCertificate(skillViewModelId: string) {
    this.store.dispatch(profileActions.deleteCertificate({skillViewModelId}));
    this.skillsEdited.next();
  }

  public undoCertificateDeletion(skillViewModelId: string) {
    this.store.dispatch(profileActions.undoDeleteCertificate({skillViewModelId}));
  }

  public addCertificateUpload(skillViewModelId: string, certificate: NewSkillCertificate) {
    this.store.dispatch(profileActions.addCertificateUpload({skillViewModelId, certificate}));
    this.skillsEdited.next();
  }

  public clearProfileData() {
    this.store.dispatch(profileActions.resetTechProfileData());
  }

  public toggleSkillDetailsView(skillViewModel: SkillViewModel) {
    if (skillViewModel.expanded) {
      this.store.dispatch(profileActions.collapseTagDetailsView({skillViewModelId: skillViewModel.id}));
    } else {
      this.store.dispatch(profileActions.expandTagDetailsView({skillViewModelId: skillViewModel.id}));
    }
  }

  public collapseTagDetailsView(skillViewModel: SkillViewModel) {
    this.store.dispatch(profileActions.collapseTagDetailsView({skillViewModelId: skillViewModel.id}));
  }

  private getSkillsToAdd(skillViewModels: SkillViewModel[], technicianExternalId: string): SkillWithViewModelId[] {
    return skillViewModels.filter(skillViewModel => !skillViewModel.skill && skillViewModel.selected)
      .map(skillViewModel => ({
        viewModelId: skillViewModel.id,
        tagExternalId: skillViewModel.tag.externalId,
        technicianExternalId: technicianExternalId,
      }));
  }

  private getSkillsToRemove(skillViewModels: SkillViewModel[]): Skill[] {
    return skillViewModels.filter(skillViewModel => skillViewModel.skill && !skillViewModel.selected)
      .map(skillViewModel => skillViewModel.skill);
  }

  private getCertificatesToAdd(skillViewModels: SkillViewModel[]): NewCertificateWithViewModelId[] {
    return skillViewModels.filter(skillViewModel => skillViewModel.newCertificate)
      .map(skillViewModel => ({...skillViewModel.newCertificate, viewModelId: skillViewModel.id}));
  }

  private getSkillIdsToRemoveCertificatesFrom(skillViewModels: SkillViewModel[]): Skill[] {
    return skillViewModels.filter(skillViewModel => skillViewModel.certificateToBeDeleted)
      .map(skillViewModel => skillViewModel.skill);
  }
}

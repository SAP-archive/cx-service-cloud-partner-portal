import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TechnicianProfileFacade } from '../../state/technician-profile.facade';
import { Skill } from '../../models/skill.model';
import { FileReaderService } from 'src/app/file-uploader/services/file-reader.service';
import { ConfigFacade } from '../../../state/config/config.facade';
import { SkillViewModel } from '../../models/skill-view.model';
import { ReportingFacade } from 'src/app/state/reporting/reporting.facade';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'pp-skills-card',
  templateUrl: './skills-card.component.html',
  styleUrls: ['./skills-card.component.scss'],
})
export class SkillsCardComponent implements OnInit, OnDestroy {
  public skillViewModels: Observable<SkillViewModel[]>;
  public destroyed = new Subject();
  public selectedSkillsCount = 0;

  constructor(
    private techniciansFacade: TechnicianProfileFacade,
    private reportingFacade: ReportingFacade,
    private fileReader: FileReaderService,
    private localisationService: LocalisationService,
    private cd: ChangeDetectorRef,
    public configFacade: ConfigFacade,
  ) {
  }

  public ngOnInit() {
    this.skillViewModels = this.techniciansFacade.skillViewModels;
    this.skillViewModels.pipe(
      tap(tags => this.selectedSkillsCount = tags.filter(tag => tag.selected).length),
    );
  }

  public ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public isLinkVisible(skillViewModel: SkillViewModel, element: HTMLElement) {
    if (!element) {
      return false;
    }
    if (skillViewModel.expanded === null) {
      let divHeight = element.offsetHeight;
      let lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
      if (lineHeight && divHeight >= 2 * lineHeight) {
        this.techniciansFacade.collapseTagDetailsView(skillViewModel);
        this.detectChanges();
        return true;
      }
      return false;
    }
    return true;
  }

  public downloadCertificate(skill: Skill) {
    this.techniciansFacade.downloadCertificate(skill);
  }

  public formatDate(sDate: string) {
    if (sDate) {
      return (new Date(sDate)).toLocaleDateString(
        this.localisationService.getInitialLocalisation().code);
    }
    return 'N/A';
  }

  public addCertificateUpload(file: File, skillViewModel: SkillViewModel) {
    this.fileReader.readContents([file]).subscribe(fileContents =>
      this.techniciansFacade.addCertificateUpload(
        skillViewModel.id,
        {
          fileName: file.name,
          fileContents,
          contentType: file.type,
          skillId: skillViewModel.skill ? skillViewModel.skill.uuid : null,
          viewModelId: skillViewModel.id,
        },
      ));
  }

  public onUploadError({error}: { error: string }): void {
    this.reportingFacade.reportError(error);
  }

  public removeCertificateUpload({id}: SkillViewModel) {
    this.techniciansFacade.removeCertificateUpload(id);
  }

  public deleteCertificate({id}: SkillViewModel) {
    this.techniciansFacade.deleteCertificate(id);
  }

  public undoCertificateDeletion({id}: SkillViewModel) {
    this.techniciansFacade.undoCertificateDeletion(id);
  }

  public toggleTag(skillViewModel: SkillViewModel) {
    skillViewModel.selected
      ? this.techniciansFacade.removeSkill(skillViewModel)
      : this.techniciansFacade.addSkill(skillViewModel);
  }

  public toggleTagDetails(skillViewModel: SkillViewModel) {
    this.techniciansFacade.toggleSkillDetailsView(skillViewModel);
  }

  private detectChanges() {
    if (!this.cd[`destroyed`]) {
      this.cd.detectChanges();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CrowdOwnerProfileFacade } from '../../state/crowd-owner-profile.facade';
import { AuthFacade } from 'src/app/auth-module/state/auth.facade';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'pp-crowd-owner-profile-tile',
  templateUrl: './crowd-owner-profile-tile.component.html',
  styleUrls: ['./crowd-owner-profile-tile.component.scss'],
})
export class CrowdOwnerProfileTileComponent implements OnInit {

  constructor(
    private crowdOwnerFacade: CrowdOwnerProfileFacade,
    private authFacade: AuthFacade,
    private sanitizer: DomSanitizer,
    ) {}

    public isLoading = this.crowdOwnerFacade.isLoading;
    public contactDetails = this.crowdOwnerFacade.contactDetails;
    public hasLogo = this.crowdOwnerFacade.hasLogoAvailable;
    public logo = this.crowdOwnerFacade.companyLogo.pipe(
      filter(value => !!value),
      map(base64String => this.sanitizer.bypassSecurityTrustUrl(base64String)));
    public companyName = this.authFacade.companyName;

  public ngOnInit() {
    this.crowdOwnerFacade.loadContactInfo();
    this.crowdOwnerFacade.loadCompanyLogo();
  }
}

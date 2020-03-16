import { Component } from '@angular/core';
import { CompanyProfileFacade } from '../../state/company-profile.facade';
import { CompanyProfileService } from '../../services/company-profile.service';

@Component({
  selector: 'pp-company-profile-tile',
  templateUrl: './company-profile-tile.component.html',
  styleUrls: ['./company-profile-tile.component.scss'],
})
export class CompanyProfileTileComponent {
  public name = this.companyProfileFacade.name;

  constructor(private companyProfileFacade: CompanyProfileFacade,
              private companyProfileService: CompanyProfileService) {
  }

  public navigateToEditor() {
    this.companyProfileService.navigateToEditor();
  }
}

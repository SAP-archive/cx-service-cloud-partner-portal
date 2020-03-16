import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TechnicianDetailsEditorComponent } from '../../technician-details-module/components/technician-details-editor/technician-details-editor.component';
import { CompanyProfileEditorComponent } from '../../company-profile-module/components/company-profile-editor/company-profile-editor.component';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsavedGuard implements CanDeactivate<TechnicianDetailsEditorComponent | CompanyProfileEditorComponent> {

  public canDeactivate(component: TechnicianDetailsEditorComponent | CompanyProfileEditorComponent) {
    if (component.onPageLeaving && typeof(component.onPageLeaving) === 'function') {
      return component.onPageLeaving();
    } else {
      return of(true);
    }
  }
}

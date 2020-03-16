import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { ServiceArea } from '../../model/service-area.model';

export const serviceAreaFormValidator: ValidatorFn = (control): ValidationErrors => {
  const enableError = {serviceAreaIsNotValid: true};
  const disableError = {};
  if (control.value) {
    return isServiceAreaValid(control.value as ServiceArea) ? disableError : enableError;
  }

  return disableError;
};

export function isServiceAreaValid(area: ServiceArea): Boolean {
  const valid = true;
  const invalid = false;
  if (!area) {
    return valid;
  }

  if (!area.googlePlaceId) {
    if (area.radius.value === null || area.radius.value >= 1 ) {
      return valid;
    }
    return invalid;
  } else {
    if (isNaN(area.radius.value) || area.radius.value === null || area.radius.value < 1) {
      return invalid;
    }
    return valid;
  }
}

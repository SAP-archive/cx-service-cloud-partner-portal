import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class PasswordsErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidControl = control.invalid && control.parent.dirty;
    const invalidParent = control.dirty && control.parent.invalid && control.parent.dirty;

    return invalidControl || invalidParent;
  }
}

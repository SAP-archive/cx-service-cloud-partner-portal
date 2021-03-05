import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { emptyTechnician, Technician } from '../../../technicians-list-module/models/technician.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pp-technicians-selector',
  templateUrl: './technicians-selector.component.html',
  styleUrls: ['./technicians-selector.component.scss'],
})
export class TechniciansSelectorComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public technicians: Technician[] = [];
  @Input() public responsible: Technician = emptyTechnician();
  @Input() public disabled: boolean;
  @Input() public inputId: string;
  @Input() public label = '';
  @Output() public responsibleChanged: EventEmitter<Technician> = new EventEmitter<Technician>();
  @Output() public isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  public fullNames: string[] = [];
  public formControl: FormControl = new FormControl();
  public filteredOptions: Observable<string[]>;
  private $onDestroy: Subject<void> = new Subject<void>();

  public ngOnChanges(): void {
    if (this.responsible && this.getFullName(this.responsible)) {
      this.formControl.setValue(this.getFullName(this.responsible));
    }
    if (this.technicians && this.technicians.length > 0) {
      this.fullNames = this.technicians.map(technician => this.getFullName(technician));
    }

    if (!this.responsible || !this.responsible.externalId) {
      this.isValid.emit(false);
    }
  }

  public ngOnInit(): void {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      takeUntil(this.$onDestroy),
      startWith(''),
      map(value => this.getFilteredTechnicians(value)),
      tap(values => {
        if (this.fullNames.length && !values.length) {
          this.formControl.setErrors({invalidInput: true});
          this.isValid.emit(false);
        }
      }),
    );
  }

  public changeResponsiblePerson(technicianName: string) {
    this.validationCheck(technicianName.trim());
    if (this.formControl.valid && this.getFullName(this.responsible) !== technicianName.trim()) {
      this.formControl.setValue(technicianName);
      this.responsibleChanged.emit(this.findTechnicianByName(technicianName));
    }
  }

  public clearInput() {
    this.formControl.setValue('');
  }

  public getErrorMessage() {
    if (this.formControl.hasError('required')) {
      return 'FIELD_IS_REQUIRED';
    }
    if (this.formControl.hasError('noMatchedError')) {
      return 'NO_MATCHED_TECHNICIAN';
    }
  }

  public ngOnDestroy(): void {
    this.$onDestroy.next();
    this.$onDestroy.complete();
  }

  private getFilteredTechnicians(input: string): string[] {
    const inputValue = input.replace(' ', '').toLowerCase();
    return this.fullNames.filter(name => name.replace(' ', '').toLowerCase().includes(inputValue));
  }

  private getFullName(technician: Technician): string {
    return `${technician.firstName} ${technician.lastName}`;
  }

  private validationCheck(inputName: string) {
    let isValid = true;
    if (!inputName) {
      this.formControl.setErrors({required: true});
      isValid = false;
    }
    if (inputName && !this.fullNames.includes(inputName.trim())) {
      this.formControl.setErrors({noMatchedError: true});
      isValid = false;
    }
    this.isValid.emit(isValid);
  }

  private findTechnicianByName(fullName: string): Technician {
    return this.technicians.find(technician => `${technician.firstName} ${technician.lastName}` === fullName);
  }
}

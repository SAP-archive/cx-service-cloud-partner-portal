import { Observable, Subject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Technician } from '../../../technicians-list-module/models/technician.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'pp-technicians-selector',
  templateUrl: './technicians-selector.component.html',
  styleUrls: ['./technicians-selector.component.scss']
})
export class TechniciansSelectorComponent implements OnChanges, OnDestroy {
  @Input() public technicians: Technician[] = [];
  @Input() public responsibleId: string = '';
  @Input() public disabled: boolean = false;
  @Input() public allowNull: boolean = false;
  @Input() public label: string = '';
  @Output() public responsibleChanged: EventEmitter<Technician> = new EventEmitter<Technician>();
  @Output() public isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  public fullNames: string[] = [];
  public formControl: FormControl = new FormControl();
  public filteredOptions: Observable<string[]>;
  private $onDestroy: Subject<void> = new Subject<void>();

  public ngOnChanges(): void {
    this.formControl = new FormControl({
      value: this.mapIdToName(this.responsibleId),
      disabled: this.disabled
    }, this.allowNull ? [] : [Validators.required]);
    this.fullNames = this.technicians ? this.technicians.map(technician => this.getFullName(technician)) : [];
    this.filteredOptions = this.formControl.valueChanges.pipe(
      takeUntil(this.$onDestroy),
      startWith(''),
      map(value => this.getFilteredTechnicians(value)),
      tap(values => {
        if (this.fullNames.length && !values.length) {
          this.formControl.setErrors({ invalidInput: true });
          this.isValid.emit(false);
        }
      }),
    );
  }

  public changeResponsiblePerson(technician: string) {
    this.validationCheck(technician.trim());
    if (this.formControl.valid && this.responsibleId !== technician.trim()) {
      this.responsibleChanged.emit(this.findTechnicianByName(technician));
    }
  }

  public clearInput() {
    this.formControl.setValue('');
  }

  public ngOnDestroy(): void {
    this.$onDestroy.next();
    this.$onDestroy.complete();
  }

  private getFilteredTechnicians(input: string): string[] {
    const inputValue = input.replace(' ', '').toLowerCase();
    return this.fullNames.filter(name => name.replace(' ', '').toLowerCase().indexOf(inputValue) > -1);
  }

  private getFullName(technician: Technician): string {
    return `${technician.firstName} ${technician.lastName}`;
  }

  private validationCheck(inputName: string) {
    if (!inputName && this.allowNull) {
      this.isValid.emit(true);
    } else {
      if (this.fullNames.findIndex(name => name === inputName.trim()) < 0) {
        this.formControl.setErrors({ invalidInput: true });
        this.isValid.emit(false);
      } else {
        this.isValid.emit(true);
      }
    }
  }

  private mapIdToName(id: string) {
    const selectedTechnician = this.technicians.find(technician => technician.externalId === id);
    return selectedTechnician ? `${selectedTechnician.firstName} ${selectedTechnician.lastName}` : '';
  }

  private findTechnicianByName(fullName: string): Technician {
    return this.technicians.find(technician => `${technician.firstName} ${technician.lastName}` === fullName);
  }
}

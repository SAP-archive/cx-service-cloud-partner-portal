import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { LocalisationService } from '../../../services/localisation.service';
import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'pp-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent implements OnInit, OnChanges {
  @Input() public dateTimeValue: Date | string;
  @Input() public minDate: Date | string;
  @Input() public maxDate: Date | string;
  @Input() public disabled: boolean = false;
  @Input() public allowNull: boolean = true;
  @Input() public label: string = '';
  @Output() public onDateTimeChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  public dtControl: FormControl;

  constructor(private locationService: LocalisationService, private dateTimeAdapter: NgxMatDateAdapter<any>) {
    const locale = this.locationService.localisation.language ? this.locationService.localisation.language : 'en';
    this.dateTimeAdapter.setLocale(locale);
  }

  public ngOnChanges() {
    this.dateTimeValue = this.transformDateFromString(this.dateTimeValue as string);
    this.minDate = this.minDate ? new Date(this.minDate) : null;
    this.maxDate = this.maxDate ? new Date(this.maxDate) : null;
  }

  public ngOnInit() {
    const validators = this.allowNull ? [] : Validators.required;
    this.dtControl = new FormControl({
      value: this.dateTimeValue,
      disabled: this.disabled,
    }, validators);
  }

  public dateTimeChange(dateTime: Date) {
    if (this.dtControl.valid) {
      this.isValid.emit(true);
      this.onDateTimeChange.emit(dateTime);
    } else {
      this.isValid.emit(false);
    }
  }

  private transformDateFromString(dtString: string): Date {
    return dtString ? moment(dtString).toDate() : new Date();
  }
}

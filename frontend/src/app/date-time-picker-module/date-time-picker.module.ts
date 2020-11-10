import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTimePickerMaterialModule } from './date-time-picker-material.module';
import { DateTimePickerComponent } from './component/date-time-picker/date-time-picker.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    DateTimePickerMaterialModule,
  ],
  declarations: [
    DateTimePickerComponent,
  ],
  exports: [
    DateTimePickerComponent,
  ]
})
export class CsDateTimePickerModule {
}

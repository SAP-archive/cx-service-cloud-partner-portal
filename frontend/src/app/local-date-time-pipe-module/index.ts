import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalDateTimePipe } from './localDateTime.pipe';

@NgModule({
  declarations: [
    LocalDateTimePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LocalDateTimePipe,
  ],
})
export class LocalDateTimePipeModule {
}

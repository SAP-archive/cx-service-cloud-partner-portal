import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateNumberPipe } from './truncate-number.pipe';

@NgModule({
  declarations: [
    TruncateNumberPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TruncateNumberPipe,
  ],
})
export class TruncateNumberPipeModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbbreviatePipe } from './abbreviate.pipe';

@NgModule({
  declarations: [
    AbbreviatePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    AbbreviatePipe,
  ],
})
export class AbbreviatePipeModule {
}

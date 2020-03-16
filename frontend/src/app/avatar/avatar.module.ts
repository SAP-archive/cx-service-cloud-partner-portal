import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar.component';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    AbbreviatePipeModule,
  ],
  declarations: [
    AvatarComponent,
  ],
  exports: [
    AvatarComponent,
  ],
})
export class AvatarModule {
}

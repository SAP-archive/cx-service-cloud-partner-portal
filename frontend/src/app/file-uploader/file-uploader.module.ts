import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileReaderService } from './services/file-reader.service';
import { FileReaderFactory } from './services/file-reader.factory';
import { translateModule } from '../utils/translate.module';
import { BytesHumanizerPipe } from './services/bytes-humanizer.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule,
    translateModule,
  ],
  declarations: [
    FileUploaderComponent,
    BytesHumanizerPipe,
  ],
  providers: [
    FileReaderService,
    FileReaderFactory,
  ],
  exports: [
    FileUploaderComponent,
    BytesHumanizerPipe,
  ],
})
export class FileUploaderModule {
}

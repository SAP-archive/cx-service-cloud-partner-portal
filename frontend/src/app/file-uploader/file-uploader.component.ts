import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'pp-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FileUploaderComponent {
  @Output() public dropped: EventEmitter<File> = new EventEmitter<File>();
  @Output() public errorOccurred: EventEmitter<{error: string}> = new EventEmitter();
  @Input() public maxSize: number = 0;

  public onDrop(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (this.maxSize && file.size > this.maxSize) {
            this.errorOccurred.emit({error: 'UPLOADED_FILE_IS_TOO_BIG'});
          } else {
            this.dropped.emit(file);
          }
        });
      }
    }
  }
}

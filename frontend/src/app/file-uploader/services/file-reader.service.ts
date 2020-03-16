import { Observable, Subject } from 'rxjs';
import { FileReaderFactory } from './file-reader.factory';

export class FileReaderService {

  constructor(private fileReaderFactory: FileReaderFactory) {
  }

  public readContents(files: File[]): Observable<string> {
    const subject = new Subject<string>();
    let readNumber = 0;

    files.forEach(file => {
      let fileReader = this.fileReaderFactory.newFileReader();
      fileReader.onload = () => {
        subject.next(btoa(fileReader.result as string));
        readNumber++;
        if (readNumber === files.length) {
          subject.complete();
        }
      };
      fileReader.readAsBinaryString(file);
    });

    return subject.asObservable();
  }
}

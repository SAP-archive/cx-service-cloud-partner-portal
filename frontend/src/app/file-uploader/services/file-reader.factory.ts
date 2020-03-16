import { Injectable } from '@angular/core';

@Injectable()
export class FileReaderFactory {
  public newFileReader() {
    return new FileReader();
  }
}


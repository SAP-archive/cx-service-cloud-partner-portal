import { fakeAsync, tick } from '@angular/core/testing';
import { FileReaderService } from './file-reader.service';

describe('FileReaderService', () => {
  let fileReaderService: FileReaderService;
  let promises: Promise<any>[];
  const fileContent = 'some content';

  beforeEach(() => {
    promises = [];

    fileReaderService = new FileReaderService({
      newFileReader: () => {
        const fileReaderMock = {
          readAsBinaryString: () => setTimeout(fileReaderMock.onload),
          result: fileContent,
        } as any;
        return fileReaderMock;
      },
    });
  });

  describe('readAsAttachments()', () => {
    it('should return a stream of read attachments', fakeAsync(() => {
      const filesToRead = [fakeFile('file_1'), fakeFile('file_2')];
      let hasFinished = false;
      let readAttachments = [];

      fileReaderService.readContents(filesToRead as File[]).subscribe(
        attachment => readAttachments.push(attachment),
        null,
        () => hasFinished = true,
      );
      tick();

      expect(hasFinished).toBe(true);
      expect(readAttachments).toEqual([
        'c29tZSBjb250ZW50',
        'c29tZSBjb250ZW50',
      ]);
    }));
  });

  function fakeFile(name: string) {
    return {name: name, type: 'application/pdf'};
  }
});

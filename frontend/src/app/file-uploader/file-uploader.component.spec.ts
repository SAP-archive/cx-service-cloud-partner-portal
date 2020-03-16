import { FileUploaderComponent } from './file-uploader.component';
import { take } from 'rxjs/operators';

describe('FileUploaderComponent', () => {
  describe('onDrop()', () => {
    it('should emit dropped files', (done) => {
      const component = new FileUploaderComponent();
      component.maxSize = 100;

      const file = (): File => ({actual: 'file', size: 10} as any);
      const dropEntry = {
        fileEntry: {
          isFile: true,
          file: (callback) => callback(file()),
        },
      };

      component.dropped.pipe(take(1)).subscribe(emmitedFile => {
        expect(emmitedFile).toEqual(file());
        done();
      });

      component.onDrop([
        dropEntry as any,
      ]);
    });

    it('should report files that are too big', (done) => {
      const component = new FileUploaderComponent();
      component.maxSize = 100;

      const file = (): File => ({actual: 'file', size: 300} as any);
      const dropEntry = {
        fileEntry: {
          isFile: true,
          file: (callback) => callback(file()),
        },
      };

      component.errorOccurred.pipe(take(1)).subscribe(emmitedError => {
        expect(emmitedError).toEqual({error: 'UPLOADED_FILE_IS_TOO_BIG'});
        done();
      });

      component.onDrop([
        dropEntry as any,
      ]);
    });
  });
});

import { EMPTY } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;

export class MatDialogMockBuilder {
  private response: any = EMPTY;
  private mock = jasmine.createSpyObj<MatDialog>([
    'open',
    'closeAll',
  ]);

  public withResponse(response: any) {
    this.response = response;
    return this;
  }

  public build(): SpyObj<MatDialog> {
    this.mock.open.and.returnValue({
      afterClosed: () => this.response,
    } as MatDialogRef<any> as any);
    return this.mock;
  }
}

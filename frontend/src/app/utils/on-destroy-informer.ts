import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class OnDestroyInformer implements OnDestroy {
  protected onDestroy: Subject<undefined> = new Subject();

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}

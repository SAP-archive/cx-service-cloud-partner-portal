import { Component, OnInit } from '@angular/core';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { OnDestroyInformer } from '../../../utils/on-destroy-informer';

@Component({
  selector: 'pp-assignments-board-search',
  templateUrl: './assignments-board-search.html',
  styleUrls: ['./assignments-board-search.scss'],
})
export class AssignmentsBoardSearchComponent extends OnDestroyInformer implements OnInit {
  public query: string;
  private queryObservable = new BehaviorSubject<string>('');

  constructor(private assignmentsListFacade: AssignmentsListFacade) {
    super();
  }

  public ngOnInit(): void {
    this.queryObservable
      .pipe(
        takeUntil(this.onDestroy),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe(() => this.assignmentsListFacade.search(this.query));
  }

  public search() {
    this.queryObservable.next(this.query);
  }

  public resetQuery() {
    this.query = '';
    this.search();
  }
}

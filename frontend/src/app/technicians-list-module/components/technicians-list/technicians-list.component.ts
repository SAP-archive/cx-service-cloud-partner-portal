import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Technician } from '../../models/technician.model';
import { TechniciansFacade } from '../../state/technicians.facade';
import { filter, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UnifiedPerson } from 'src/app/model/unified-person.model';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/state';
import { selectPerson } from 'src/app/state/user/user.selectors';
import { loadTechnicians } from '../../state/technicians.actions';

@Component({
  styleUrls: ['technicians-list.component.scss'],
  templateUrl: 'technicians-list.component.html',
  selector: 'technicians-list',
})
export class TechniciansListComponent implements OnInit, OnDestroy {
  public searchQuery: string;
  public person: Observable<UnifiedPerson>;
  private queryObservable = new BehaviorSubject<string>('');
  private onDestroy: Subject<undefined> = new Subject();

  constructor(
    public techniciansFacade: TechniciansFacade,
    public dialog: MatDialog,
    public store: Store<RootState>,
  ) {
  }

  public ngOnInit() {
    this.queryObservable
      .pipe(takeUntil(this.onDestroy), debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.techniciansFacade.searchTechnicians(this.searchQuery));
    this.person = this.store.pipe(select(selectPerson), filter(person => !!person));
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public fetchNextPage(): void {
    this.store.dispatch(loadTechnicians());
  }

  public getFullTechnicianName(technician: Technician): string {
    return `${technician.firstName} ${technician.lastName}`;
  }

  public onQueryChange() {
    this.queryObservable.next(this.searchQuery);
  }

  public resetSearchQuery() {
    this.searchQuery = '';
    this.onQueryChange();
  }
}

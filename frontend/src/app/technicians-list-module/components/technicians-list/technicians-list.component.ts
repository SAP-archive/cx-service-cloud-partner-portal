import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Technician } from '../../models/technician.model';
import { TechniciansFacade } from '../../state/technicians.facade';
import { filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RemovalConfirmationDialogComponent } from '../removal-confirmation-dialog/removal-confirmation-dialog.component';
import { UnifiedPerson } from 'src/app/model/unified-person.model';
import { Store, select } from '@ngrx/store';
import { RootState } from 'src/app/state';
import { selectPerson } from 'src/app/state/user/user.selectors';

@Component({
  styleUrls: ['technicians-list.component.scss'],
  templateUrl: 'technicians-list.component.html',
  selector: 'technicians-list',
})
export class TechniciansListComponent implements OnInit {
  public loadingTechnicians: Observable<boolean>;
  public technicians: Observable<Technician[]>;
  public searchQuery: string;
  public person: Observable<UnifiedPerson>;
  private queryObservable = new BehaviorSubject<string>('');


  constructor(
    public techniciansFacade: TechniciansFacade,
    public dialog: MatDialog,
    public store: Store<RootState>,
  ) {
  }

  public ngOnInit() {
    this.technicians = combineLatest([
      this.techniciansFacade.technicians,
      this.queryObservable,
    ]).pipe(
      map(([technicians, searchQuery]) => technicians.filter(technician =>
        this.getFullTechnicianName(technician).toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )),
    );

    this.techniciansFacade.loadTechnicians();
    this.person = this.store.pipe(
      select(selectPerson),
      filter(person => !!person),
    );
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

  public deleteTechnician(technician: Technician) {
    this.dialog.open<RemovalConfirmationDialogComponent, string, boolean>(
      RemovalConfirmationDialogComponent,
      {
        data: this.getFullTechnicianName(technician),
      },
    )
      .afterClosed()
      .pipe(filter(confirmed => !!confirmed))
      .subscribe(() => this.techniciansFacade.deleteTechnician(technician));
  }
}

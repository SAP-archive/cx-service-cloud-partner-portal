import { Component, OnDestroy, OnInit } from '@angular/core';
import { Assignment } from '../../model/assignment';
import { MatDialog } from '@angular/material/dialog';
import { Technician } from '../../../technicians-list-module/models/technician.model';
import { map, take, takeUntil } from 'rxjs/operators';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { Observable, Subject } from 'rxjs';
import { DetailsDisplayMode } from '../../model/details-display-mode';
import { AssignmentEditableFields } from '../../model/assignment-editable-fields';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { isOngoing, isReadyToPlan } from '../../utils/assignments-columns-helper';

@Component({
  selector: 'pp-assignments-details',
  templateUrl: './assignments-details.component.html',
  styleUrls: ['./assignments-details.component.scss'],
})
export class AssignmentsDetailsComponent implements OnInit, OnDestroy {
  public isLoading: Observable<boolean>;
  public technicians: Observable<Technician[]>;
  public techniciansToHandoverTo: Observable<Technician[]>;
  public displayMode: Observable<DetailsDisplayMode>;
  public originalAssignment: Assignment;
  public assignment: Assignment;
  public formErrorsCounter: AssignmentEditableFields[] = [];
  public isReadyToPlan = isReadyToPlan;
  public isOngoing = isOngoing;
  private onDestroy$: Subject<void> = new Subject<void>();
  private handoverToPerson: Technician;

  constructor(
    private dialogService: MatDialog,
    private assignmentsListFacade: AssignmentsListFacade,
    private assignmentsDetailsFacade: AssignmentsDetailsFacade,
    private bottomSheetService: MatBottomSheet,
  ) {
    this.assignmentsDetailsFacade.loadTechnicians();
  }

  public ngOnInit() {
    this.isLoading = this.assignmentsDetailsFacade.isLoading$;
    this.technicians = this.assignmentsDetailsFacade.technicians$;
    this.displayMode = this.assignmentsDetailsFacade.displayMode$;
    this.assignmentsDetailsFacade.displayedAssignment$.pipe(takeUntil(this.onDestroy$)).subscribe(assignment => {
      this.originalAssignment = assignment;
      this.assignment = {...this.originalAssignment};
      this.techniciansToHandoverTo = this.getTechniciansToHandoverTo();
    });
  }

  public updateValidation(isValid: boolean, field: AssignmentEditableFields) {
    const index = this.formErrorsCounter.indexOf(field);
    if (!isValid && (index < 0)) {
      this.formErrorsCounter.push(field);
    }
    if (isValid && (index > -1)) {
      this.formErrorsCounter.splice(index, 1);
    }
  }

  public updateEndDateTime(endDateTime: Date) {
    this.assignment.endDateTime = endDateTime.toJSON();
  }

  public updateStartDateTime(startDateTime: Date) {
    this.assignment.startDateTime = startDateTime.toJSON();
  }

  public updateResponsiblePerson(responsiblePerson: Technician) {
    this.assignment.responsiblePerson = responsiblePerson;
  }

  public updateHandoverToPerson(person: Technician) {
    this.handoverToPerson = person;
  }

  public releaseAssignment(updatedAssignment: Assignment) {
    this.assignmentsListFacade.release(updatedAssignment);
    this.closeDetails();
  }

  public handoverAssignment(updatedAssignment: Assignment) {
    this.assignmentsListFacade.handover({...updatedAssignment, responsiblePerson: this.handoverToPerson});
    this.closeDetails();
  }

  public closeDetails() {
    this.assignmentsDetailsFacade.displayMode$.pipe(
      take(1),
    ).subscribe(mode => {
      mode === 'web' ? this.dialogService.closeAll() : this.bottomSheetService.dismiss();
    });
    this.assignmentsDetailsFacade.reset();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getTechniciansToHandoverTo() {
    return this.technicians.pipe(
      map(technicians => technicians
        .filter(technician => technician.externalId !== this.assignment.responsiblePerson.externalId),
      ),
    );
  }
}

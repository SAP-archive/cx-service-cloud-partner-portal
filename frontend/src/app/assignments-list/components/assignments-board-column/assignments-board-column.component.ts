import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { Assignment } from '../../model/assignment';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { ColumnName } from '../../model/column-name';
import { FetchingFilter } from '../../model/fetching-filter';
import { CdkDrag, CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { isClosed, isNew, isOngoing, isReadyToPlan } from '../../utils/assignments-columns-helper';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'pp-assignments-board-column',
  templateUrl: './assignments-board-column.component.html',
  styleUrls: [
    './assignments-board-column.component.scss',
    './drag-and-drop.scss',
  ],
})
export class AssignmentsBoardColumnComponent implements OnInit {
  @Input() public columnName: ColumnName;
  @Input() public fetchingFilter: FetchingFilter;
  @ViewChild(CdkVirtualScrollViewport) public viewport: CdkVirtualScrollViewport;
  public assignments: Observable<Assignment[]>;
  public isLoading: Observable<boolean>;
  public canReceiveDraggedAssignment: Observable<boolean>;
  public isOriginalColumnOfDraggedAssignment: Observable<boolean>;
  public dragTimeout: number;

  constructor(private assignmentsListFacade: AssignmentsListFacade,
              public deviceDetectorService: DeviceDetectorService) {
  }

  public ngOnInit(): void {
    this.dragTimeout = this.deviceDetectorService.isDesktop() ? 0 : 100;
    this.assignmentsListFacade.setFilter(this.columnName, this.fetchingFilter);
    this.assignments = this.assignmentsListFacade.getAssignments(this.columnName);
    this.isLoading = this.assignmentsListFacade.getIsLoading(this.columnName);
    this.canReceiveDraggedAssignment = this.assignmentsListFacade.draggedAssignment.pipe(
      filter(draggedAssignment => !!draggedAssignment),
      map(draggedAssignment => this.isAssignmentReceivable(draggedAssignment)),
    );
    this.isOriginalColumnOfDraggedAssignment = this.assignmentsListFacade.draggedAssignment.pipe(
      filter(draggedAssignment => !!draggedAssignment),
      map(draggedAssignment => this.isComingFromCurrentColumn(draggedAssignment)),
    );
  }

  public scrolledIndexChange() {
    if (this.viewport.getRenderedRange().end === this.viewport.getDataLength()) {
      this.assignmentsListFacade.getHasFetchedAll(this.columnName)
        .pipe(
          take(1),
          filter(hasFetchedAll => !hasFetchedAll),
          withLatestFrom(this.assignmentsListFacade.getIsLoading(this.columnName)),
          filter(([, isLoading]) => !isLoading),
        )
        .subscribe(() => this.assignmentsListFacade.loadNextPage(this.columnName));
    }
  }

  public onDrop($event: CdkDragDrop<Assignment[]>) {
    const assignment = $event.item.data as Assignment;
    if (this.isAssignmentReceivable(assignment)) {
      this.assignmentsListFacade.advanceAssignment(assignment);
    }
  }

  public onDragStart($event: CdkDragStart) {
    this.assignmentsListFacade.startDragging($event.source.data);
  }

  public onDragEnd() {
    this.assignmentsListFacade.endDragging();
  }

  public enterPredicate({data}: CdkDrag<Assignment>) {
    return this.isAssignmentReceivable(data);
  }

  private isAssignmentReceivable(draggedAssignment: Assignment) {
    return this.columnName === 'ASSIGNMENTS_BOARD_READY_TO_PLAN' && isNew(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_ONGOING' && isReadyToPlan(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_CLOSED' && isOngoing(draggedAssignment);
  }

  private isComingFromCurrentColumn(draggedAssignment: Assignment) {
    return this.columnName === 'ASSIGNMENTS_BOARD_NEW' && isNew(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_READY_TO_PLAN' && isReadyToPlan(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_ONGOING' && isOngoing(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_CLOSED' && isClosed(draggedAssignment);
  }

  public isWindows() {
    return navigator.userAgent && navigator.userAgent.toLowerCase().includes('windows');
  }
}

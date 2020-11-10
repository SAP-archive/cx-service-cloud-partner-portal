import { Component, OnDestroy } from '@angular/core';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';

@Component({
  selector: 'pp-assignments-board',
  templateUrl: './assignments-board.component.html',
  styleUrls: ['./assignments-board.component.scss'],
})
export class AssignmentsBoardComponent implements OnDestroy {
  public isUpdating = this.assignmentsListFacade.isUpdating;

  constructor(private assignmentsListFacade: AssignmentsListFacade) {
  }

  public ngOnDestroy() {
    this.assignmentsListFacade.reset();
  }
}

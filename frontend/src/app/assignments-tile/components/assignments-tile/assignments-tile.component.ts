import { Component, OnInit } from '@angular/core';
import { AssignmentsTileFacade } from '../../state/assignments-tile.facade';

@Component({
  selector: 'pp-assignments-tile',
  templateUrl: './assignments-tile.component.html',
  styleUrls: ['./assignments-tile.component.scss'],
})
export class AssignmentsTileComponent implements OnInit {
  public isLoading = this.assignmentsTileFacade.isLoading;
  public assignmentsStats = this.assignmentsTileFacade.assignmentsStats;

  constructor(private assignmentsTileFacade: AssignmentsTileFacade) {
  }

  public ngOnInit(): void {
    this.assignmentsTileFacade.loadAssignmentsStats();
  }
}

export interface AssignmentDispatchDTO {
    activityId: string;
    technicianId: string;
}

export const exampleAssignmentDispatchDTO = (): AssignmentDispatchDTO =>  ({
    activityId: '123',
    technicianId: '321',
});

export type AssignmentDispatchActions = 'accept' | 'reject' | 'notify' | 'confirm' | 'release';

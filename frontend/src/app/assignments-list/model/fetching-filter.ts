import { DispatchingStatus } from './dispatching-status';
import { ServiceAssignmentState } from './service-assignment-state';

export interface FetchingFilter {
  partnerDispatchingStatus?: DispatchingStatus;
  serviceAssignmentState?: ServiceAssignmentState;
}

export const exampleFetchingFilter = (): FetchingFilter => ({
  partnerDispatchingStatus: 'ACCEPTED',
});

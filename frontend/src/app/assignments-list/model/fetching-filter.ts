import { DispatchingStatus } from './dispatching-status';
import { ServiceAssignmentState } from './service-assignment-state';

export interface FetchingFilter {
  partnerDispatchingStatus?: DispatchingStatus;
  serviceAssignmentState?: ServiceAssignmentState[];
  query?: string;
}

export const exampleFetchingFilter = (): FetchingFilter => ({
  partnerDispatchingStatus: 'ACCEPTED',
  query: '123',
});

import { RecursivePartial } from './recursive-partial';
import { RootState } from '../state';
import { BehaviorSubject } from 'rxjs';

export const getStoreMock = (initialState: RecursivePartial<RootState>) => {
  const store: any = new BehaviorSubject(initialState);
  store.dispatch = () => null;
  spyOn(store, 'dispatch');
  return store;
};

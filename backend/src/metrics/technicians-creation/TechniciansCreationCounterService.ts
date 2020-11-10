import { Observable, Subject } from 'rxjs';

export interface CreationMetric {
  crowdAccountId: string;
  cloudHost: string;
}

export class TechniciansCreationCounterService {
  private static readonly subject: Subject<CreationMetric> = new Subject();

  public static countCreation(creationMetric: CreationMetric) {
    this.subject.next(creationMetric);
  }

  public static getCreations$(): Observable<CreationMetric> {
    return this.subject.asObservable();
  }
}

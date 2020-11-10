import { Observable, Subject } from 'rxjs';

export interface SignInMetricData {
  crowdAccountName: string;
  cloudHost: string;
}

export class SignInsCounterService {
  private static readonly successfulSignIns: Subject<SignInMetricData> = new Subject();
  private static readonly unauthorizedSignInTries: Subject<SignInMetricData> = new Subject();
  private static readonly signInsResultingInOtherErrors: Subject<SignInMetricData> = new Subject();

  public static countSuccessfulSignIn(creationMetric: SignInMetricData) {
    this.successfulSignIns.next(creationMetric);
  }

  public static countUnauthorizedSignInTry(creationMetric: SignInMetricData) {
    this.unauthorizedSignInTries.next(creationMetric);
  }

  public static countSignInTryResultingInOtherError(creationMetric: SignInMetricData) {
    this.signInsResultingInOtherErrors.next(creationMetric);
  }

  public static getSuccessfulSignIns$(): Observable<SignInMetricData> {
    return this.successfulSignIns.asObservable();
  }

  public static getUnauthorizedSignInTries$(): Observable<SignInMetricData> {
    return this.unauthorizedSignInTries.asObservable();
  }

  public static getSignInsResultingInOtherErrors(): Observable<SignInMetricData> {
    return this.signInsResultingInOtherErrors.asObservable();
  }
}

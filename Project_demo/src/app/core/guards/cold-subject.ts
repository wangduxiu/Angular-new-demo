import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';

/**
 * A subject that waits for execution until a subscriber is registered.
 *
 * Needed for guards in a compositeGuard, because otherwise they are executed before inspected.
 * The compositeGuard will collect all observables of all CanActivate methods first, and then resolve them sequentially, but stops when one returns false.
 * So that's why a guard shouldn't start their logic when canActivate is called, but when a subscription is made.
 *
 */
export class ColdSubject extends Subject<boolean> {

  constructor(private execution: (subject: ColdSubject) => void | Observable<boolean> | boolean) {
    super();
  }

  protected _subscribe(subscriber: Subscriber<boolean>): Subscription {
    let subscription = super._subscribe(subscriber);
    this.execute();
    return subscription;
  }

  /*
    // for rxjs 5.5.12
    protected _trySubscribe(subscriber: Subscriber<boolean>): AnonymousSubscription | Function | void {
        let subscription = super._trySubscribe(subscriber);
        this.execute();
        return subscription;
    }
  */

  private execute() {
    try {
      const result = this.execution(this);
      if (this.isObservable(result)) {
        let isCompleted = false; // Make sure it completes even if user forgets it.
        result.subscribe(
          next => {
            this.next(next);
            this.complete();
            isCompleted = true;
          },
          error => this.error(error),
          () => !isCompleted && this.complete(),
        );
      } else if (this.isPromise(result)) {
        let isCompleted = false; // Make sure it completes even if user forgets it.
        result.then(
          next => {
            this.next(next);
            this.complete();
            isCompleted = true;
          },
          error => this.error(error),
        );
      } else if (typeof result === 'boolean') {
        // is boolean
        this.next(result);
        this.complete();
      } else {
        throw new Error('Result type not supported');
      }
    } catch (error) {
      this.error(error);
    }
  }

  private isObservable(object: any): object is Observable<boolean> {
    return typeof object === 'object' && 'subscribe' in object;
  }
  private isPromise(object: any): object is Promise<boolean> {
    return typeof object === 'object' && 'then' in object;
  }
}

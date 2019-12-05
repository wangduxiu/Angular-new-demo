import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {ColdSubject} from 'app/core/guards/cold-subject';
import * as fromRoot from 'app/core/store';
import {CalendarClearStateAction} from 'app/core/store/calendar/calendar.actions';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';

/**
 * Guard to synchronously clear orders filter & result
 */
export class CalendarClearStateUnguard implements CanDeactivate<any> {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(subject => {
      logger.debug('In ClearInvoicesFilterGuard');
      this.store.dispatch(new CalendarClearStateAction());
      return true;
    })
  }
}

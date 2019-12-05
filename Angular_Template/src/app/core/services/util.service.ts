import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  /**
   * Checks is the application is online or not
   */
  public checkOnlineStatus(): Observable<boolean> {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable<boolean>(sub => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }
}

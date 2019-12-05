import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as routerActions from '../store/router/router.actions';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {State} from '@app/core/store/store';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(
    protected store: Store<State>,
    private router: Router,
    private location: Location
  ) {}

  /**
   * Navigate to given path with given parameters
   */
  public navigate(path: string, query?: object, extras?: any): void {
    this.store.dispatch(
      new routerActions.Go({
        path: [path],
        query: query,
        extras: { replaceUrl: false }
      })
    );

    this.router.navigate([path], { query, ...extras });
  }

  /**
   * Navigate back to previous path
   */
  public navigateBack(): void {
    this.store.dispatch(new routerActions.Back());
    this.location.back();
  }

  /**
   * Navigate forward to forward path
   */
  public navigateForward(): void {
    this.store.dispatch(new routerActions.Forward());
    this.location.forward();
  }
}

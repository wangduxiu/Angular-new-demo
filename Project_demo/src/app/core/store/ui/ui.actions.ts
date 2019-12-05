import { Action } from '@ngrx/store';

/**
 * Action type generators
 */
const BUSY = (tag: string) => `[${tag}] busy`;
const BUSY_DONE = (tag: string) => `[${tag}] not busy`;
const LOCK = (tag: string) => `[${tag}] lock`;
const UNLOCK = (tag: string) => `[${tag}] unlock`;

/**
 * Actions
 */
export class Busy implements Action {
  readonly type;
  ui;

  constructor(public tag: string) {
    // Create unique tag for debugging reasons
    this.type = BUSY(tag);

    // Generate ui state change
    this.ui = {
      id: tag,
      busy: true,
    };
  }
}

export class BusyDone implements Action {
  readonly type;
  ui;

  constructor(public tag: string) {
    // Create unique tag for debugging reasons
    this.type = BUSY_DONE(tag);

    // Generate ui state change
    this.ui = {
      id: tag,
      busy: false,
    };
  }
}

export class Lock implements Action {
  readonly type;
  ui;

  constructor(public tag: string) {
    // Create unique tag for debugging reasons
    this.type = LOCK(tag);

    // Generate ui state change
    this.ui = {
      id: tag,
      busy: true,
      lock: true,
    };
  }
}

export class UnLock implements Action {
  readonly type;
  ui;

  constructor(public tag: string) {
    // Create unique tag for debugging reasons
    this.type = UNLOCK(tag);

    // Generate ui state change
    this.ui = {
      id: tag,
      busy: false,
      lock: false,
    };
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types.
 */
export type Actions = Busy | BusyDone | Lock | UnLock;

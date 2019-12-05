import { Store } from '@ngrx/store';
import {State} from '@app/core/store/store';

export abstract class Sandbox {
  constructor(protected store: Store<State>) {}
}

import { Sandbox } from '@app/core/sandboxes/base.sandbox';
import { OnDestroy } from '@angular/core';

export class AbstractContainer<S extends Sandbox | void> implements OnDestroy {
  protected destroyed = false;

  constructor(protected sandbox: S) {}

  ngOnDestroy(): void {
    this.destroyed = true;
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'europool-loadingbar',
  template: `
    <div class="loading-progress-bar" *ngIf="loading">
      <md-progress-bar mode="indeterminate"></md-progress-bar>
    </div>
    `,
})
export class LoadingbarComponent {
  @Input() loading: boolean = false;

  constructor() {}
}

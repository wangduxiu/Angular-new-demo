import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.less'],
})
export class Label {

  @Input()
  translationCode: string;

  @Input()
  optional: boolean;

  constructor() {
  }
}

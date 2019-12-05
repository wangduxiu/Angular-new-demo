import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.less'],
})
export class WindowComponent {

  @Input()
  headerHtml: string;

  @Input()
  footerHtml: string;

  constructor() { }

}

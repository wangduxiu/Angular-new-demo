import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tutorial-menu',
  templateUrl: './tutorial-menu.component.html',
  styleUrls: ['./tutorial-menu.component.less']
})
export class TutorialMenuComponent {
  @Input() tutorials: any[];
  @Input() toggleTutorial: (item: string) => void;
  @Input() checked = true;

  constructor() { }
}

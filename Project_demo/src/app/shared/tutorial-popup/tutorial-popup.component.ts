import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../core/store';

@Component({
  selector: 'app-tutorial-popup',
  templateUrl: './tutorial-popup.component.html',
  styleUrls: ['./tutorial-popup.component.less']
})
export class TutorialPopupComponent{
  @Input() goToTutorials: () => void;
  @Input() hideTutorial: (forEver: boolean) => void;

  constructor() { }
}

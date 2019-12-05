import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Tutorial, TutorialInfo } from './../models/tutorial.model';
import { AppState } from './../app.state';
import * as TutorialActions from './../actions/tutorial.actions';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  public info: string;

  tutorials: Observable<Tutorial[]>;
  tutorialInfo: Observable<TutorialInfo[]>;

  constructor(private store: Store<AppState>) {
    this.tutorials = store.select('tutorial')
    this.tutorialInfo = store.select('tutorialInfo')
  }

  delTutorial(index) {
    this.store.dispatch(new TutorialActions.RemoveTutorial(index))
  }

  //点击按钮修改值
  modifyTutorial(tutorial: any, i: any) {
    console.log(tutorial, i);
    this.store.dispatch(new TutorialActions.ModifyTutorial({ tutorial: tutorial, i: i }))
  }

  ngOnInit() { }

}

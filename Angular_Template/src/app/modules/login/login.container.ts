import { Component, OnInit } from '@angular/core';
import { AbstractContainer } from '@app/shared/abstract/abstract.container';

@Component({
  selector: 'app-login',
  templateUrl: './login.container.html',
  styleUrls: ['./login.container.scss']
})
export class LoginContainer extends AbstractContainer<void> implements OnInit {

  constructor() {
    super(null); // no sandbox used
  }

  ngOnInit() {}
}

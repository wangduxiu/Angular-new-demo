import { Component, OnInit } from '@angular/core';
import { AbstractContainer } from '@app/shared/abstract/abstract.container';

@Component({
  selector: 'app-home',
  templateUrl: './home.container.html',
  styleUrls: ['./home.container.scss']
})
export class HomeContainer extends AbstractContainer<void> implements OnInit {
  title = 'Home';
  text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
    'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
    'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur.';

  constructor() {
    super(null); // no sandbox used
  }

  ngOnInit() {}
}

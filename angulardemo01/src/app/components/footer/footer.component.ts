import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public msg:string = '我是子组件中的msg';
  constructor() { }

  ngOnInit() {
  }

  //子组件中的run方法
  run(){
    alert('我是子组件中的Run方法');
  }
}

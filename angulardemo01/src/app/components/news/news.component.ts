import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  @ViewChild('footer',{static: false}) footer: any;
  constructor() { }

  ngOnInit() {
  }

  //获取子组件中的MSG
  getSonMsg() {
    alert(this.footer.msg);
  }
  //执行子组件中的Run方法
  getSonRun() {
    this.footer.run();
  }

}

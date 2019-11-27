import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {


  public list: any[] = [];

  constructor() { }

  ngOnInit() {

    for (let index = 0; index < 10; index++) {
      this.list.push(`这是第${index}条数据`);
    }
  }

}

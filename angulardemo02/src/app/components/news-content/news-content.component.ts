/**
 * get跳转传值
 *  1.跳转 [queryParams]表示要传的值
 *  <li *ngFor="let item of list;let i = index">
        <a [routerLink]="[ '/newsContent' ]" [queryParams] = "{aid: i}">{{i}}---{{item}}</a>
    </li>
    
    2.获取
    首先引入：
      import { ActivatedRoute } from '@angular/router';
    然后声明：
      constructor(public router: ActivatedRoute) { }
    最后获取：
      this.router.queryParams.subscribe((data)=>{
        console.log(data);
      })


    动态路由获取传值

    1.配置动态路由：
     path:'newsContent/:aid',component:NewsContentComponent
     跳转 i表示 传的值
     <a [routerLink]="[ '/newsContent', i ]">{{i}}---{{item}}</a> 
    
     2.获取
     首先引入：
     import { ActivatedRoute } from '@angular/router';
     然后声明：
     constructor(public router: ActivatedRoute) { }
     最后获取：
     this.router.params.subscribe((data)=>{
       console.log(data);
     })     
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-content',
  templateUrl: './news-content.component.html',
  styleUrls: ['./news-content.component.scss']
})
export class NewsContentComponent implements OnInit {

  constructor(public router: ActivatedRoute) { }

  ngOnInit() {
    //get跳转传值获取
    // this.router.queryParams.subscribe((data) => {
    //   console.log(data);
    // })

    //动态路由获取
    this.router.params.subscribe((data)=>{
      console.log(data);
    })
  }

}

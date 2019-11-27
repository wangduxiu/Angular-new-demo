/**
 * Js动态路由跳转
 * 1.引入：
 *  import { Router } from '@angular/router';
 *  声明：
 *  constructor(public router: Router) { }
 *  定义路由：！参数必须传
 *  <a [routerLink]="[ '/productcontent', '123' ]">跳转商品详情</a>
 *  定义方法：
 *  <button (click)="goProduct()">JS实现路由跳转商品详情</button>
 *  <button (click)="goHome()">JS实现路由跳转首页</button>
 *  实现方法：
 *  goProduct() {
     //路由跳转
     this.router.navigate(['/productcontent','123'])
    }
    goHome(){
     this.router.navigate(['/home'])
    }
 * 
 * 
 * JS get传值跳转
 * 1.引入：NavigationExtras
 *    import { Router, NavigationExtras } from '@angular/router';
 *   先设置queryParams：
 *    let queryParams: NavigationExtras = {
       queryParams: { 'proId': 123 }
      };
     实现跳转：1.参数'123'指的是跳转到商品详情页面必须的参数，一定要带上 
              2.pid指的是传过去的值
       this.router.navigate(['/productcontent','123'], queryParams);
 *   
 * 
 * 
 */

import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  goProduct() {
    //路由跳转
    this.router.navigate(['/productcontent', '123'])
  }


  goHome() {
    this.router.navigate(['/home'])
  }

  //JS get传值跳转
  goProductByGet() {
    //先设置queryParams
    let queryParams: NavigationExtras = {
      queryParams: { 'proId': 123 }
    };
    this.router.navigate(['/productcontent','123'], queryParams);
  }

}

import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public request: RequestService) { }

  ngOnInit() {
    //同步获取数据
    let data = this.request.getData();
    console.log(data);

    //callback获取异步数据
    this.request.getCallBackData((data) => {
      console.log(data);
    });

    //Promise获取异步数据
    let promiseData = this.request.getPromiseData();
    promiseData.then((data) => {
      console.log(data);
    });

    //Rxjs获取异步数据
    // let rxjs = this.request.getRxjsData();
    // rxjs.subscribe((data)=>{
    //   console.log(data);     
    // })

    //过1s撤回刚才rxjs的操作
    // let streem = this.request.getRxjsData();
    // let back = streem.subscribe((data)=>{
    //   console.log(data);      
    // })
    // setTimeout(() => {
    //   back.unsubscribe(); //取消操作
    // }, 1000);

    //多次执行rxjs的操作
    let intervalRxjsData = this.request.getIntervalRxjsData();
    setTimeout(() => {
      intervalRxjsData.subscribe((data) => {
        console.log(data);
      });
    }, 4000);
  }
}

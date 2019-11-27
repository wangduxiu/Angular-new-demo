import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor() { }

  //同步方法
  getData() {
    return 'this is service data';
  }

  //callback
  getCallBackData(cb) {
    setTimeout(() => {
      let name = '张三'
      cb(name);
    }, 3000);
  }

  //promise
  getPromiseData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        let username = '张三---Promise'
        resolve(username);
      }, 3000);
    })
  }

  //Rxjs
  getRxjsData() {
    return new Observable((obser) => {
      setTimeout(() => {
        let username = '张三---Rxjs'
        obser.next(username);
      }, 3000);
    })
  }

  //多次执行rxjs的操作
  getIntervalRxjsData() {
    return new Observable((obser) => {
      setInterval(() => {
        let username = '张三---Rxjs(执行多次)'
        obser.next(username);
      }, 1000);
    })
  }
}

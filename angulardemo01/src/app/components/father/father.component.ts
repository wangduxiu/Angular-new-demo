import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss']
})
export class FatherComponent implements OnInit {

  // 定义要传到子组件的值
  public msgFather: any = '我是父组件中的msg';

  constructor() { }

  ngOnInit() {
  }
  
  //接收子组件传递过来的数据
  runFather(msgSon:any){
    // console.log(msgSon);
    alert(msgSon);
  }

  //父组件中的方法
  run(){
    alert('我是父组件中的方法');
  }

  //获取子组件中的MSG
  getSonMsg(){

  }
  //执行子组件中的方法
  getSonRun(){

  }
}

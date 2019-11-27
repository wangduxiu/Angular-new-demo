import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-son',
  templateUrl: './son.component.html',
  styleUrls: ['./son.component.scss']
})
export class SonComponent implements OnInit {
  // 接收父组件传来的数据
  @Input() msgFather: string;
  //接收父组件传过来的方法
  @Input() run: any;
  //把整个父组件穿个子组件
  @Input() father:any;
  // 实例化EventEmitter
  @Output() private outer = new EventEmitter<any>();
  public son_title: any = '我是son组件中的title';
  public msgSon: any = '我是子组件中的msg';
  constructor() { }

  ngOnInit() {
  }

  //子组件通过EventEmitter 对象outer 实例广播数据
  sendFather() {
    alert('zhixing');
    // this.outer.emit('msg from son')
  }
  //获取父组件传给子组件的MSG
  getFatherMsg(){
    // alert(this.msgFather);
    alert(this.father.msgFather);
  }
  //执行父组件传给子组件的方法
  getFatherRun(){
    // this.run();
    this.father.run();  
  }

  //子组件的方法
  runSon(){
    alert('我是子组件的run方法');
  }

}

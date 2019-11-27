import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public app_title: string = '我是根组件中的title';
  public msg: any = '我是根组件的message';
  public content: any = '<h2>我是content</h2>';
  public username: any = '张三';
  public student: any = '我是张三的属性';
  public userinfo: object = {
    username: '张三',
    age: 12
  };
  public list: any[] = ['111', '222', '333'];
  public studentInfo: any[] = [
    {
      username: '张三',
      age: 12
    },
    {
      username: '李四',
      age: 13
    },
    {
      username: '王五',
      age: 14
    }
  ];
  public car: any[] = [
    {
      name: '宝马',
      type: [
        {
          style: '宝马1系',
          price: '10万'
        },
        {
          style: '宝马2系',
          price: '20万'
        },
        {
          style: '宝马3系',
          price: '30万'
        }
      ]
    },
    {
      name: '奥迪',
      type: [
        {
          style: '奥迪1系',
          price: '10万'
        },
        {
          style: '奥迪2系',
          price: '20万'
        },
        {
          style: '奥迪3系',
          price: '30万'
        }
      ]
    },
    {
      name: '奔驰',
      type: [
        {
          style: '奔驰1系',
          price: '10万'
        },
        {
          style: '奔驰2系',
          price: '20万'
        },
        {
          style: '奔驰3系',
          price: '30万'
        }
      ]
    }
  ];
  public score: any = 1;
  public inputValue: any;
  public flag = false;
  public arr = [1, 3, 4, 5, 6];
  public attr = 'red';
  public today = new Date();

  constructor(public http: HttpClient) {

  }

  ngOnInit(): void {
    var api = "http://a.itying.com/api/productlist";
    this.http.get(api).subscribe(response => {
      console.log(response);
    });

    // const httpOptions = {
    //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    // };
    // var api = "http://127.0.0.1:3000/doLogin";
    // this.http.post(api, { username: '张三', age: '20' }, httpOptions).subscribe(response => {
    //   console.log(response);
    // });

    var api = "http://a.itying.com/api/productlist";
    this.http.jsonp(api, 'callback').subscribe(response => {
      console.log(response);
    });
  }
  getData() {
    alert(this.msg);
  }
  setData() {
    this.msg = '我是改变后的MSG';
    alert(this.msg);
  }
  keyUpFn(e) {
    console.log(e.keyCode)
  }
  changeData(e) {
    this.inputValue = '我是改变后的inputValue';
  }

}

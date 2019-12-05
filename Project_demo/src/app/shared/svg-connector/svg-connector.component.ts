import { Component, Input, OnInit } from '@angular/core';

type Point = {x: number; y: number};

@Component({
  selector: 'app-connector',
  templateUrl: './svg-connector.component.html',
  styleUrls: ['./svg-connector.component.less'],
})
export class SvgConnectorComponent implements OnInit {

  @Input() width: number;

  @Input() height: number;

  start: Point;
  end: Point;

  path: string;

  constructor() { }

  ngOnInit() {
    this.start = { x: this.width - 5, y: 5 };
    this.end = { x: this.width - 5, y: this.height - 5 };
    const s = this.start;
    const e = this.end;
    const horCp = -(this.width - 5);
    const verCp = 15;

    this.path = `M ${s.x} ${s.y} c ${horCp} ${verCp} ${horCp} ${this.height - 10 - verCp} 0 ${this.height - 10}`;
  }

}

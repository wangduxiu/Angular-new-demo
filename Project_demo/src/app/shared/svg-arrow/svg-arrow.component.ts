import { Component, Input, OnInit } from '@angular/core';

type Point = {x: number; y: number};

@Component({
  selector: 'app-arrow',
  templateUrl: './svg-arrow.component.html',
  styleUrls: ['./svg-arrow.component.less'],
})
export class SvgArrowComponent implements OnInit {

  @Input() width: number;

  start: Point;
  end: Point;
  path: string;

  constructor() { }

  ngOnInit() {
    this.start = { x: 5, y: 5 };
    this.end = { x: this.width - 5, y: 5 };
    const e = this.end;
    this.path = `M ${e.x + 4} ${e.y} l -8 -5 l 0 10 z`;
  }
}

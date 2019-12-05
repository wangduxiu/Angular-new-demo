import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Tile } from './tile.interface';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.less']
})
export class TileComponent implements OnInit {

  @Input() tile: Tile;
  @Input() loading: boolean;

  @Output() tileClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}

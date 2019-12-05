import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TilesGroupedByLetter } from '../tile/tile.interface';

@Component({
  selector: 'tile-list',
  templateUrl: './tile-list.component.html',
  styleUrls: ['./tile-list.component.less'],
})
export class TileListComponent implements OnInit {
  @Input() tilesGroupedByLetter: TilesGroupedByLetter[] = [];
  @Input() tileIdLoading: string;
  @Input() filterToNarrowTranslationCode: string;
  @Output() tileClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

}

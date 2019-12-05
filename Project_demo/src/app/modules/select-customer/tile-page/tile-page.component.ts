import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Tile, TilesGroupedByLetter} from '../tile/tile.interface';

@Component({
  selector: 'tile-page',
  templateUrl: './tile-page.component.html',
  styleUrls: ['./tile-page.component.less'],
})
export class TilePageComponent implements OnInit, OnChanges {
  @Input() tilesGroupedByLetter: TilesGroupedByLetter[];
  @Input() noTilesFoundTranslationCode: string;
  @Input() filterToNarrowTranslationCode: string;
  @Input() tileIdLoading: string;
  @Input() clearFilter: EventEmitter<boolean>;
  @Input() parentTile?: Tile;
  @Output() tileClicked = new EventEmitter();

  filteredTilesGroupedByLetter: TilesGroupedByLetter[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.tilesGroupedByLetter){
      this.filteredTilesGroupedByLetter = this.tilesGroupedByLetter;
    }
  }

  updateFilteredTiles(tiles: TilesGroupedByLetter[]) {
    this.filteredTilesGroupedByLetter = tiles;
  }

  sortFilteredTiles(tiles: TilesGroupedByLetter[]) {
    this.filteredTilesGroupedByLetter = tiles;
  }
}

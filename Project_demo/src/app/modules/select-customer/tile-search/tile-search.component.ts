import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TilesGroupedByLetter } from '../tile/tile.interface';

@Component({
  selector: 'tile-search',
  templateUrl: './tile-search.component.html',
  styleUrls: ['./tile-search.component.less'],
})
export class TileSearch implements OnInit {
  // inputs & outputs
  @Input() tilesGroupedByLetter: TilesGroupedByLetter[];
  @Output() filteredTilesUpdated = new EventEmitter();
  @Input() clearFilter: EventEmitter<boolean>;
  // variables
  filter: string = '';
  filteredTilesGroupedByLetter;
  constructor() {}

  ngOnInit() {
    this.clearFilter && this.clearFilter.subscribe(clear => {
      if (clear) {
        this.filter = '';
      }
    })
  }

  filterList(filterQuery) {
    filterQuery = filterQuery.toLowerCase();
    if (filterQuery === '') {
      this.filteredTilesGroupedByLetter = this.tilesGroupedByLetter;
    } else {
      this.filteredTilesGroupedByLetter = this.tilesGroupedByLetter.map((tiles: TilesGroupedByLetter) => {
        return {firstLetter: tiles.firstLetter, tiles: tiles.tiles.filter(tile => tile.name.toLowerCase().includes(filterQuery) || (tile.number && tile.number.toLowerCase().includes(filterQuery) || (tile.role && tile.role.toLowerCase().includes(filterQuery))))}
      }).filter(tiles => tiles.tiles.length > 0);
    }
    this.filteredTilesUpdated.emit(this.filteredTilesGroupedByLetter);
  }
}

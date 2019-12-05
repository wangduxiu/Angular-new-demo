export interface Tile {
  id: string;
  number ?: string,
  name: string,
  role?: string
}

export interface TilesGroupedByLetter {
  firstLetter: string,
  tiles: Tile[],
}

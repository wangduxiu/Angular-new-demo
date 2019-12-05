import { Materialish } from '../florder-detail/florder-detail.interface';

export interface CCREditMaterialLine extends Materialish {
  packingsPerPallet: string;
  numberOfPallets: string;
  packingQuantity: string;
  ccrPackingsPerPallet: string;
  ccrNumberOfPallets: string;
  ccrPackingQuantity: string;
}

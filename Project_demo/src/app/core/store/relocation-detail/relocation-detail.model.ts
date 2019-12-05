import { initialStateEditFlorderDetail, initialStateFlorderDetail } from '../florder-detail/florder-detail.model';
import { EditRelocationDetail } from './relocation-detail.interface';

export const initialStateEditRelocationDetail: EditRelocationDetail = Object.assign({}, initialStateEditFlorderDetail, {
  mode: {
    ...initialStateEditFlorderDetail.mode,
    type: 'relocation',
  },
  relocationDetail: initialStateFlorderDetail,
  availableLoadingDates: {
    loading: false,
    loaded: false,
    from: [],
    to: []
  },
  materialsState: {
    loading: false,
    loadSuccess: false,
    loadFailed: false,
    data: {
      combination: {
        palletIds: []
      },
      packings: [],
      pallets: []
    }
  }
});

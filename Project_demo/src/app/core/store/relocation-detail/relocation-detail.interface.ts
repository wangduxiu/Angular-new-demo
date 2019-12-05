import { LoadState } from 'app/core/model/generic.interface';
import { MaterialTypes } from 'app/core/store/contract-details/contract-details.interface';
import { EditFlorderDetail, FlorderDetail, HasRecurrenceDates } from '../florder-detail/florder-detail.interface';

export interface EditRelocationDetail extends EditFlorderDetail, HasRecurrenceDates {
  relocationDetail: FlorderDetail;
  availableLoadingDates: LoadingDates;
  materialsState: LoadState<MaterialTypes>;
}

export interface LoadingDates {
  loading: boolean;
  loaded: boolean;
  from: string[],
  to: string[]
}

export interface LoadingDatesTO {
  fromDates: string[];
  toDates: string[];
}

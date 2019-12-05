import { EditFlorderDetail, FlorderDetail } from '../florder-detail/florder-detail.interface';

export interface EditFlowDetail extends EditFlorderDetail{
  flowDetail: FlorderDetail;
  datesRange: DatesRange;
  flowDate : {
    CheckFlowDateResponse: CheckFlowDateResponse;
  };
}

export interface CheckFlowDateResponse {
  flowDate: string;
  flowWeek: {
    weekNo: number;
    year: number;
  };
  frequency: string;
}

export interface DatesRange {
  startDate: string;
  endDate: string;
}

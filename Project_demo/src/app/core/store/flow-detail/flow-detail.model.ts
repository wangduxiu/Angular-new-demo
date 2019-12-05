import { EditFlowDetail } from 'app/core/store/flow-detail/flow-detail.interface';
import { initialStateEditFlorderDetail, initialStateFlorderDetail } from '../florder-detail/florder-detail.model';

export const initialStateEditFlowDetail: EditFlowDetail = Object.assign({}, initialStateEditFlorderDetail, {
  flowDetail: initialStateFlorderDetail,
  datesRange: {
    // start: '2017-07-16',
    // end: '2017-07-28'
    startDate: '',
    endDate: '',
  },
  flowDate: {
    CheckFlowDateResponse: {
      flowDate: '',
      flowWeek: {
        weekNo: null,
        year: null,
      },
      frequency: '',
    }
  }
});

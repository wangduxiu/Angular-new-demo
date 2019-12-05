import { RecurrenceDates } from 'app/core/store/order-detail/order-detail.interface';

const response: RecurrenceDates = {
  recurrentOrderDates: [
    {
      requestedDate: '2018-03-12',
      valid: false,
      proposedDate: '2018-03-13',
      proposedValid: true
    },
    {
      requestedDate: '2018-03-22',
      valid: false,
      proposedDate: '2018-03-23',
      proposedValid: true
    },
    {
      requestedDate: '2018-04-02',
      valid: true,
    }
  ]
};

export default response;

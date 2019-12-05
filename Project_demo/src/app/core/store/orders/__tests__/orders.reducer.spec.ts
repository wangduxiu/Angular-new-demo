import { reducer } from '../orders.reducer';
import { OrdersLoadAction, OrdersLoadSuccessAction } from '../orders.actions';
import { initialState } from '../../florders/florders.model';
import { initialFlorder } from '../../florders/florder.model';
import { initialState as initialStateDefinitions } from '../../definitions/definitions.model';
import { Definitions } from '../../definitions/definitions.interface';
import { FlorderTO } from '../../florders/florder.interface';


const initialFlorderTO: FlorderTO = {
  id: undefined,
  orderType: undefined,
  orderDate: undefined,
  customerRefNumber: undefined,
  salesOrderNumber: undefined,
  etmOrderNumber: undefined,
  deliveryNumber: undefined,
  shipmentNumber: undefined,
  senderRefNumber: undefined,
  requestedUnloadingDate: undefined,
  confirmedUnloadingDate: undefined,
  transport: undefined,
  globalType: undefined,
  orderStatus: undefined,
  from: undefined,
  to: undefined,
  executeHandshake: false,
  hasChanged: false,
  ccr: {
    ccrNumber: 0,
    sealNumber: '',
    ccrLineItems: [],
    approved:'Open'
  }
};

describe('OrdersReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = reducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  const definitions: Definitions = Object.assign({}, initialStateDefinitions);

  describe('loading orders', () => {
    it('should set the flag \'loading\' on true when loading', () => {
      const result = reducer(initialState, new OrdersLoadAction());
      expect(result.loading).toBeTruthy();
    });
    it('should set the flag \'loading\' on false when loading successful', () => {
      const result = reducer(initialState, new OrdersLoadSuccessAction({ definitions, places: {}, orders: { items: [], totalItems: 1 } }));
      expect(result.loading).toBeFalsy();
    });
    const result = reducer(
      initialState,
      new OrdersLoadSuccessAction({
        definitions,
        places: {},
        orders: {
          items: [Object.assign({}, initialFlorderTO, { etmOrderNumber: 1, salesOrderNumber: '1' }), Object.assign({}, initialFlorderTO, { etmOrderNumber: 2, salesOrderNumber: '2' })],
          totalItems: 1
        }
      }));
    it('should set the flag \'loaded\' on true when loading successful', () => {
      expect(result.loaded).toBeTruthy();
    });
    it('orders should contain 2 orders', () => {
      expect(result.items.length).toBe(2);
    });
  });
});

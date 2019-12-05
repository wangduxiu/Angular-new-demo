import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { AvailablePickingDates, CalculatedTruckLoad, DeliveryMethod, FlorderDetail, OrderDetailTO } from '../../store/florder-detail/florder-detail.interface';
import { FlordersFilter } from '../../store/florders/florders-filter.interface';
import { FlordersTO } from '../../store/florders/florders.interface';
import { RecurrenceDates } from '../../store/order-detail/order-detail.interface';
import { util } from '../../util/util';
import { default as cachedOrder } from './responses/getOrder';
import { default as cachedOrders } from './responses/getOrders';
import { default as cachedOrdersForCalendar } from './responses/getOrdersCalendar';
import { RestService } from './rest.service';
import { Customer } from '../../store/user-context/user-context.interface';
import { DayWithFlordersInfoTO } from '../../store/calendar/calendar.interface';

@Injectable()
export class OrderRestService {
  constructor(protected restService: RestService) {
  }

  getOrders(filter: FlordersFilter, customers: Customer[] = null): Observable<FlordersTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getOrders');
      return Observable.of(cachedOrders as FlordersTO);
    } else {
      if (filter != null) {
        const params = this.getQueryParams({}, filter, customers);
        return this.restService.get<FlordersTO>(`/Order/query?${params}`);
      }
      return this.restService.get<FlordersTO>('/Order/query');
    }
  }

  getOrdersForCalendar(filter: FlordersFilter, customers: Customer[] = null): Observable<DayWithFlordersInfoTO[]> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getOrders');
      return Observable.of(cachedOrdersForCalendar as DayWithFlordersInfoTO[]);
    } else {
      const params = this.getQueryParams({}, filter, customers);
      return this.restService.get<DayWithFlordersInfoTO[]>(`/Order/listOrderNumbers?${params}`);
    }
  }

  getOrdersAsDocument(filter: FlordersFilter, totalItems: number, exportType: string, customerIds: string[] = []) {
    if (filter != null) {
      const params = this.getQueryParams({ExportType: exportType}, {...filter, pageNr: 1, pageSize: totalItems});
      let url = `/Order/listOrdersAsDocument?${params}`;
      if (customerIds && customerIds.length) {
        url += '&' + util.serializeObjectToParams({customerId: customerIds});
      }
      return this.restService.getBlobData(url);
    }
    return this.restService.getBlobData(`/Order/listOrdersAsDocument?ExportType=${exportType}`);
  }


  getOrder(etmOrderNr: string, salesOrderNumber: string, customerIds: string[] = []): Observable<OrderDetailTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getOrder');
      return Observable.of(cachedOrder as OrderDetailTO);
    } else {
      let url = `/Order/get?EtmOrderNumber=${etmOrderNr}`;
      if (salesOrderNumber) {
        url += `&SalesOrderNumber=${salesOrderNumber}`;
      }

      if (customerIds && customerIds.length) {
        url += '&' + util.serializeObjectToParams({customerId: customerIds});
      }
      return this.restService.get<OrderDetailTO>(url);
    }
  }

  getDeliveryDates(deliveryMethod: DeliveryMethod, startDate?: string): Observable<AvailablePickingDates> {
    const time = moment().format('HH:mm:ss');
    const url = `/Order/getDeliveryDates?OrderType=${deliveryMethod.type}&FromId=${deliveryMethod.from.id}&ToId=${deliveryMethod.to.id}&Transport=${deliveryMethod.shippingCondition && deliveryMethod.shippingCondition.id}&NumberOfMonths=6&time=${time}`;
    return this.restService.get<AvailablePickingDates>(url);
  }

  createOrder(florderDetail: FlorderDetail, emailAddresses: string[]): Observable<FlorderDetail> {
    const postData = this.createPostData(florderDetail, emailAddresses);
    return this.restService.post<FlorderDetail>('/Order/create', postData);
  }


  /**
   * Calculates the load of the truck
   * @param {FlorderDetail} florderDetail
   * @returns {Observable<FlorderDetail>}
   */
  checkPalletFloorQuantitySuccessDummy(florderDetail: FlorderDetail): Observable<CalculatedTruckLoad> {
    // Don't do rest call in case of only packings.  Will always be good & quantity == 0
    return Observable.of(
      {
        orderLineInfo: {
          fullTruck: false,
          quantity: florderDetail.materials.filter(m => m.type === 'pallet').reduce((res, m) => res + parseInt(m.numberOfPallets, 10), 0) + '',
          maxAmountOfPalletExchangeAvailable: 0,
          orderLines: [],
          loadedEpp: null,
          maxEpp: null,
        },
        message: {
          description: null,
          type: null
        }
      });
  }

  /**
   * Calculates the load of the truck
   * @param {FlorderDetail} florderDetail
   * @param type order or relocation
   * @returns {Observable<FlorderDetail>}
   */
  checkPalletFloorQuantity(florderDetail: FlorderDetail, type: String = 'Order'): Observable<CalculatedTruckLoad> {
    if (florderDetail.materials.find(m => m.type === 'combination') == null) {
      // Don't do rest call in case of only packings.  Will always be good & quantity == 0
      return this.checkPalletFloorQuantitySuccessDummy(florderDetail);
    }
    let postData: any = this.createPostData(florderDetail);
    postData = util.removeNullOrUndefined(postData);
    postData.requestedUnloadingDate = util.formatDate(new Date());
    return this.restService
      .post<any>('/' + type + '/checkPalletFloorQuantity', postData)
      .map(result => JSON.parse(result._body))
      .catch(result => {
        return Observable.throw({
          status: result.status, ...JSON.parse(result._body),
        });
      });
  }

  getRecurrenceDates(orderDetail: FlorderDetail): Observable<RecurrenceDates> {
    let recurrence = orderDetail.planning.recurrence;
    let postData = {
      ...this.createPostData(orderDetail),
      recurrence: {
        pattern: recurrence.pattern,
        startDate: orderDetail.planning.loadingDate,
        endDate: recurrence.endDate,
        weekly: (recurrence.pattern === 'weekly') && {
          monday: recurrence.weekly.monday,
          tuesday: recurrence.weekly.tuesday,
          wednesday: recurrence.weekly.wednesday,
          thursday: recurrence.weekly.thursday,
          friday: recurrence.weekly.friday,
          saturday: recurrence.weekly.saturday,
          sunday: recurrence.weekly.sunday,
        } || null,
        monthly: (recurrence.pattern === 'monthly') && {
          monthlyRecurrenceType: recurrence.monthly.monthlyRecurrencyType,
          day: recurrence.monthly.day,
          whichDay: recurrence.monthly.which,
          weekday: recurrence.monthly.weekday,
          monthlyPeriodicity: recurrence.monthly.monthlyRecurrencyType === 'nrOfDay' && recurrence.monthly.monthPeriodicy1 || recurrence.monthly.monthPeriodicy2
        } || null
      }
    };
    postData = util.removeNullOrUndefined(postData);
    return this.restService
      .post<any>('/Order/getRecurrentOrderDates', postData)
      .map(result => JSON.parse(result._body))
      .catch(result => {
        return Observable.throw({
          status: result.status, ...JSON.parse(result._body),
        });
      });
  }

  protected getQueryParams(params: any, filter: FlordersFilter, customers: Customer[] = null) {
    let customerIdsForFilter = null;
    if (filter.customers) {
      if (filter.customers.length === 0) {
        customerIdsForFilter = customers.map(c => c.id);
      } else {
        customerIdsForFilter = filter.customers;
      }
    }
    const newParamsObject = {
      ...params,
      OrderType: filter.orderTypes,
      Transport: (filter.shippingCondition !== 'all' && filter.shippingCondition) || null,
      Transporter: filter.transporter,
      OrderDateFrom: filter.florderDateFrom,
      OrderDateTo: filter.florderDateTo,
      UnloadingDateFrom: filter.unloadingDateFrom,
      UnloadingDateTo: filter.unloadingDateTo,
      PalletId: filter.palletIds,
      PackingId: filter.packingIds,
      Depot: filter.depots,
      From: filter.froms,
      To: filter.tos,
      ShipTo: filter.shipTos,
      CustomerRefNumber: filter.customerReferenceNumber || null,
      SenderRefNumber: filter.senderReferenceNumber || null,
      SalesOrderNumber: filter.salesOrderNumber || null,
      EtmOrderNumber: filter.etmDocumentNumber || null,
      Ccr: ((filter.ccrYes && filter.ccrNo) || (!filter.ccrYes && !filter.ccrNo)) ? null : filter.ccrYes,
      SealNumber: filter.sealNumber,
      PageNumber: filter.pageNr,
      PageSize: filter.pageSize,
      SortingColumn: filter.sortField,
      SortingType: filter.sortAscending ? 'asc' : 'desc',
      OrderStatus: filter.orderStatuses,
      CustomerId: customerIdsForFilter,
    };
    return util.serializeObjectToParams(newParamsObject);
  }

  protected createPostData(orderDetail: FlorderDetail, emailAddresses?: string[]): any {
    const cleanValue = (val) => (val && val.trim()) ? val.trim() : undefined;
    const postData = {
      orderType: orderDetail.deliveryMethod.type,
      soldTo: orderDetail.deliveryMethod.soldTo && orderDetail.deliveryMethod.soldTo.id || undefined,
      fromId: orderDetail.deliveryMethod.from.id,
      toId: orderDetail.deliveryMethod.to.id,
      requestedUnloadingDates: orderDetail.planning.loadingDate,
      transport: orderDetail.deliveryMethod.shippingCondition && orderDetail.deliveryMethod.shippingCondition.id || undefined,
      globalType: '',
      transporter: orderDetail.deliveryMethod.shippingCondition && orderDetail.deliveryMethod.shippingCondition.id !== 'Z1' ? orderDetail.deliveryMethod.transporter : undefined,
      licensePlate: orderDetail.deliveryMethod.shippingCondition && orderDetail.deliveryMethod.shippingCondition.id !== 'Z1' ? orderDetail.deliveryMethod.licensePlate : undefined,
      incoterm: orderDetail.deliveryMethod.incoterm && orderDetail.deliveryMethod.incoterm.id || undefined,
      customerRefNumber: orderDetail.deliveryMethod.customerReferenceNumber,
      senderRefNumber: orderDetail.deliveryMethod.senderReferenceNumber,
      exchangePallets: orderDetail.planning.exchangePallets || false,
      numberExchangePallets: orderDetail.planning.exchangePallets ? orderDetail.planning.numberOfExchangePallets || 0 : 0,
      emailAddresses: emailAddresses || [],
      lineItem: orderDetail.materials.map(m => {
        return {
          lineType: m.type,
          palletId: m.type !== 'packing' ? cleanValue(m.palletId) : undefined,
          packingId: cleanValue(m.packingId),
          packingStatus: cleanValue(m.packingStatus),
          logisticsVarietyPacking: cleanValue(m.logisticsVarietyPacking),
          packingsPerPallet: m.type !== 'packing' ? cleanValue(m.packingsPerPallet) : undefined,
          numberOfPallets: m.type !== 'packing' ? cleanValue(m.numberOfPallets) : undefined,
          packingQuantity: m.type !== 'pallet' ? cleanValue(m.packingQuantity) || parseInt(m.packingsPerPallet, 10) * parseInt(m.numberOfPallets, 10) : undefined,
        };
      }),
    };
    return postData;
  }

  acceptDeviation(ccrNumber: string): Observable<any> {
    return this.restService.post<any>('/Ccr/validate', {
      ccrNumber,
      approved: true,
    });
  }

  rejectDeviation(ccrNumber: string): Observable<any> {
    return this.restService.post<any>('/Ccr/validate', {
      ccrNumber,
      approved: false,
    });
  }

  getLatestOrders(activeCustomerId: string): Observable<FlordersTO> {
    this.restService.customerId = activeCustomerId;
    return this.restService.get<FlordersTO>(`/Order/Latest?CustomerId=${activeCustomerId}`);
  }

  getOrderTypes(activeCustomerId: string): Observable<any> {
    this.restService.customerId = activeCustomerId;
    return this.restService.get<any>(`/Customer/getOrderTypes?date=${util.formatDate(new Date())}&CustomerId=${activeCustomerId}`);
  }
}

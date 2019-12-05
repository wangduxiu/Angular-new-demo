import { Injectable } from '@angular/core';
import { MaterialTypes } from 'app/core/store/contract-details/contract-details.interface';
import { RecurrenceDates } from 'app/core/store/order-detail/order-detail.interface';
import { LoadingDatesTO } from 'app/core/store/relocation-detail/relocation-detail.interface';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AppSettings } from '../../../app.settings';
import { FlorderDetail, OrderDetailTO } from '../../store/florder-detail/florder-detail.interface';
import { FlordersFilter } from '../../store/florders/florders-filter.interface';
import { FlordersTO } from '../../store/florders/florders.interface';
import { util } from '../../util/util';
import { default as cachedOrder } from './responses/getOrder';
import { default as cachedOrders } from './responses/getOrders';
import { default as loadingDates } from './responses/getRelocationLoadingDates';
import { default as materials } from './responses/getRelocationMaterials';
import { default as recurrenceDates } from './responses/getRelocationRecurrenceDates';
import { RestService } from './rest.service';
import { Customer } from '../../store/user-context/user-context.interface';
import { DayWithFlordersInfoTO } from '../../store/calendar/calendar.interface';
import { default as cachedOrdersForCalendar } from './responses/getOrdersCalendar';

@Injectable()
export class RelocationRestService {
  constructor(protected restService: RestService) {
  }

  getRelocationsForCalendar(filter: FlordersFilter, customers: Customer[] = null): Observable<DayWithFlordersInfoTO[]> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getOrders');
      return Observable.of(cachedOrdersForCalendar as DayWithFlordersInfoTO[]);
    } else {
      const params = this.getQueryParams({}, filter);
      return this.restService.get<DayWithFlordersInfoTO[]>(`/Relocation/listRelocationNumbers?${params}`);
    }
  }

  getRelocations(filter: FlordersFilter): Observable<FlordersTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getRelocations');
      return Observable.of(cachedOrders as FlordersTO);
    } else {
      if (filter != null) {
        const params = this.getQueryParams({}, filter);
        return this.restService.get<FlordersTO>(`/Relocation/query?${params}`);
      }
      return this.restService.get<FlordersTO>('/Relocation/query');
    }
  }

  getRelocation(etmOrderNr: string, salesOrderNumber: string): Observable<OrderDetailTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getRelocation');
      return Observable.of(cachedOrder as OrderDetailTO);
    } else {
      let url = `/Relocation/get?EtmOrderNumber=${etmOrderNr}`;
      // if (salesOrderNumber) {
      //   url += `&SalesOrderNumber=${salesOrderNumber}`;
      // }
      return this.restService.get<OrderDetailTO>(url);
    }
  }

  createRelocation(relocationDetail: FlorderDetail): Observable<FlorderDetail> {
    const postData = this.createPostData(relocationDetail);
    return this.restService.post<FlorderDetail>('/Relocation/create', postData);
  }

  protected getQueryParams(params: any, filter: FlordersFilter) {
    const newParamsObject = {
      ...params,
      OrderType: filter.orderTypes,
      Transporter: filter.transporter,
      OrderDateFrom: filter.florderDateFrom,
      OrderDateTo: filter.florderDateTo,
      UnloadingDateFrom: filter.unloadingDateFrom,
      UnloadingDateTo: filter.unloadingDateTo,
      PalletId: filter.palletIds,
      From: filter.froms,
      To: filter.tos,
      CustomerRefNumber: filter.customerReferenceNumber || null,
      SenderRefNumber: filter.senderReferenceNumber || null,
      SalesOrderNumber: filter.salesOrderNumber || null,
      ShipmentNumber: filter.etmShippingNumber || null,
      EtmOrderNumber: filter.etmDocumentNumber || null,
      PageNumber: filter.pageNr,
      PageSize: filter.pageSize,
      SortingColumn: filter.sortField,
      SortingType: filter.sortAscending ? 'asc' : 'desc',
      OrderStatus: filter.orderStatuses,
    };
    return util.serializeObjectToParams(newParamsObject);
  }

  protected createPostData(relocationDetail: FlorderDetail): any {
    const cleanValue = (val) => (val && val.trim()) ? val.trim() : undefined;
    const postData = {
      orderType: relocationDetail.deliveryMethod.type,
      fromId: relocationDetail.deliveryMethod.from.id,
      toId: relocationDetail.deliveryMethod.to.id,
      requestedUnloadingDates: relocationDetail.planning.unloadingDate,
      transport: 'Z1',
      globalType: '',
      transporter: relocationDetail.deliveryMethod.transporter,
      licensePlate: relocationDetail.deliveryMethod.licensePlate,
      customerRefNumber: relocationDetail.deliveryMethod.customerReferenceNumber,
      senderRefNumber: relocationDetail.deliveryMethod.senderReferenceNumber,
      exchangePallets: relocationDetail.planning.exchangePallets || false,
      comments: cleanValue(relocationDetail.deliveryMethod.remarks),
      numberExchangePallets: relocationDetail.planning.exchangePallets ? relocationDetail.planning.numberOfExchangePallets || 0 : 0,
      lineItem: relocationDetail.materials.map(m => {
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
    if (relocationDetail.planning.loadingDate) {
      postData['requestedLoadingDate'] = relocationDetail.planning.loadingDate;
    }
    return postData;
  }

  getRecurrenceDates(relocationDetail: FlorderDetail): Observable<RecurrenceDates> {
    let recurrence = relocationDetail.planning.recurrence;
    let postData = {
      ...this.createPostData(relocationDetail),
      recurrence: {
        pattern: recurrence.pattern,
        startDate: relocationDetail.planning.unloadingDate,
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
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getRecurrenceDates');
      const subject = new Subject<RecurrenceDates>();
      setTimeout(() => {
        subject.next(recurrenceDates);
        subject.complete();
      }, 200);
      return subject.asObservable();
    } else {
      return this.restService
        .post<any>('/Relocation/getRecurrentUnloadingDates', postData)
        .map(result => JSON.parse(result._body))
        .catch(result => {
          return Observable.throw({
            status: result.status, ...JSON.parse(result._body),
          });
        });
    }
  }

  getLoadingDates({fromId, toId}: { fromId: string; toId: string }): Observable<LoadingDatesTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getLoadingDates');
      const subject = new Subject<LoadingDatesTO>();
      setTimeout(() => {
        subject.next(loadingDates);
        subject.complete();
      }, 200);
      return subject.asObservable();
    } else {
      return this.restService.get(`/Relocation/getLoadingDates?FromId=${fromId}&ToId=${toId}&NumberOfMonths=6`)
        .catch(response => {
          return Observable.throw({
            status: response.status, ...JSON.parse(response._body),
          });
        });
    }
  }

  getMaterials(depotId: string): Observable<MaterialTypes> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getMaterials');
      const subject = new Subject<MaterialTypes>();
      setTimeout(() => {
        subject.next(materials);
        subject.complete();
      }, 200);
      return subject.asObservable();
    } else {
      return this.restService.get(`/Relocation/getMaterials?DepotId=${depotId}`)
        .catch(response => {
          return Observable.throw({
            status: response.status, ...JSON.parse(response._body),
          });
        });
    }
  }
}

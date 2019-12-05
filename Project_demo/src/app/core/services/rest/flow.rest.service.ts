import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import * as moment from 'moment';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mapTo';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { DeliveryMethod, FlorderDetail, FlowDetailTO } from '../../store/florder-detail/florder-detail.interface';
import { Florder } from '../../store/florders/florder.interface';
import { FlordersFilter } from '../../store/florders/florders-filter.interface';
import { FlordersTO } from '../../store/florders/florders.interface';
import { DatesRange } from '../../store/flow-detail/flow-detail.interface';
import { util } from '../../util/util';
import { default as cachedFlow } from './responses/getFlow';
import { default as cachedFlows } from './responses/getFlows';
import { RestService } from './rest.service';

@Injectable()
export class FlowRestService {
  constructor(private restService: RestService) {}

  private TEST = false; // MUST BE FALSE !!! TODO assert via test

  getFlows(filter: FlordersFilter): Observable<FlordersTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getFlows');
      return Observable.of(cachedFlows as { totalItems: number; items: any[] });
    } else {
      if (filter != null) {
        const params = this.getQueryParams({}, filter);
        return this.restService.get<FlordersTO>(`/Flow/query?${params}`);
      }
      return this.restService.get<FlordersTO>('/Flow/query');
    }
  }

  getFlowsAsDocument(filter:FlordersFilter, totalItems: number, exportType:string) {
    if (filter != null) {
      const params = this.getQueryParams({ExportType: exportType}, { ...filter, pageNr: 1, pageSize: totalItems } );
      return this.restService.getBlobData(`/Flow/listFlowsAsDocument?${params}`);
    }
    return this.restService.getBlobData(
      `/Flow/listFlowsAsDocument?ExportType=${exportType}`
    );
  }

  getFlow(etmOrderNr: string, salesOrderNumber: string): Observable<FlowDetailTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getFlow');
      return Observable.of(cachedFlow as any);
    } else {
      let url = `/Flow/get?EtmOrderNumber=${etmOrderNr}`;
      if (salesOrderNumber) {
        url += `&SalesOrderNumber=${salesOrderNumber}`;
      }
      return this.restService.get<FlowDetailTO>(url);
    }
  }

  getDeliveryDates(deliveryMethod: DeliveryMethod, startDate?: string): Observable<DatesRange> {
    //todo : controleren of het antwoord van de server in volgend formaat is { start: "2018-10-15", end: "2018-10-20"}
    const time = moment().format('HH:mm:ss');
    const url = `/Flow/getDeliveryDates?FlowType=${deliveryMethod.type}&FromId=${deliveryMethod.from.id}&ToId=${deliveryMethod.to.id}&time=${time}`;

    return this.restService.get<DatesRange>(url);
  }

  createFlow(florderDetail: FlorderDetail): Observable<FlorderDetail> {
    const postData = this.createFlowDataCreator(florderDetail, false);
    return this.restService.post<FlorderDetail>('/Flow/create', postData);
  }

  updateFlow(florderDetail: FlorderDetail): Observable<FlorderDetail> {
    const postData = this.createFlowDataCreator(florderDetail, true);
    return this.restService.post<FlorderDetail>('/Flow/update', postData);
  }

  validateFlowDate(flowDate: string, frequency: 'T' | 'W' | 'D', fromId: string, toId: string, flowWeek): Observable<any> {
    return this.restService.post<any>('/Flow/checkFlowDate', { frequency, flowDate, flowWeek, fromId, toId });
  }

  private getQueryParams(params: any, filter:FlordersFilter){
    const newParamsObject = {
      ...params,
      FlowType: filter.flowTypes,
      FlowDateFrom: filter.florderDateFrom,
      FlowDateTo: filter.florderDateTo,
      PackingID: filter.packingIds,
      CustomerRefNumber: filter.customerReferenceNumber || null,
      SenderRefNumber: filter.senderReferenceNumber || null,
      SalesOrderNumber: filter.salesOrderNumber || null,
      EtmOrderNumber: filter.etmDocumentNumber || null,
      Clearing: ((filter.clearingYes && filter.clearingNo) || (!filter.clearingYes && !filter.clearingNo)) ? null : filter.clearingYes,
      PageNumber: filter.pageNr,
      PageSize: filter.pageSize,
      SortingColumn: filter.sortField,
      SortingType: filter.sortAscending ? 'asc' : 'desc',
      FlowStatus:  filter.flowStatuses,
      handshakeDateFrom: filter.handshakeDateFrom,
      handshakeDateTo: filter.handshakeDateTo,
      From: filter.froms,
      To: filter.tos,
      ShipTo: filter.shipTos,
    };
    return util.serializeObjectToParams(newParamsObject);
  }

  acceptFlow(flow: Florder): Observable<any> {
    const postData = this.acceptFlowDataCreator(flow);
    if (this.TEST) {
      logger.debug('acceptFlow in TEST MODE *************$');
      logger.debug(postData);
      return Observable.timer(2000).mapTo({_body: JSON.stringify({ status: "01", etmOrderNumber: flow.etmOrderNumber })});
    } else {
      return this.restService.post<FlorderDetail>('/Flow/accept', postData);
    }
  }

  cancelFlow(flow: Florder): Observable<any> {
    const postData = this.cancelFlowDataCreator(flow);
    if (this.TEST) {
      logger.debug('cancelFlow in TEST MODE *************$');
      logger.debug(postData);
      return Observable.timer(2000).mapTo({_body: JSON.stringify({ status: "04", etmOrderNumber: flow.etmOrderNumber })});
    } else {
      return this.restService.post<FlorderDetail>('/Flow/cancel', postData);
    }
  }

  private cancelFlowDataCreator(flow: Florder) {
    const postData = {
      etmOrderNumber: flow.etmOrderNumber,
      salesOrderNumber: null, // Can be empty according to SOAP example
      deliveryNumber: null, // Can be empty according to SOAP example
      shipmentNumber: null, // Can be empty according to SOAP example
      updateTime: flow.updateTime,
      updateDate: flow.updateDate,
      updateBy: flow.updateBy,
    };
    return postData;
  }

  private createFlowDataCreator(florderDetail: FlorderDetail, isUpdate: boolean) {
    const postData = {
      flowDate: florderDetail.planning.flowDate,
      flowType: florderDetail.deliveryMethod.type,
      fromId: florderDetail.deliveryMethod.from.id,
      toId: florderDetail.deliveryMethod.to.id,
      clearing: florderDetail.deliveryMethod.clearing,
      transporter: florderDetail.deliveryMethod.transporter,
      licensePlate: florderDetail.deliveryMethod.licensePlate,
      customerRefNumber: florderDetail.deliveryMethod.customerReferenceNumber,
      senderRefNumber: florderDetail.deliveryMethod.senderReferenceNumber,
      comments: florderDetail.deliveryMethod.remarks,
      etmOrderNumber: florderDetail.etmOrderNumber,
      salesOrderNumber: florderDetail.salesOrderNumber,
      wholesalerId: florderDetail.deliveryMethod.wholesaler && florderDetail.deliveryMethod.wholesaler.id && florderDetail.deliveryMethod.wholesaler.id.trim() || null,
      updateTime: isUpdate ? florderDetail.updateTime : undefined,
      updateDate: isUpdate ? florderDetail.updateDate : undefined,
      updateBy: isUpdate ? florderDetail.updateBy : undefined,

      lineItem: florderDetail.materials.map(m => {
        return {
          itemNumber: !isUpdate || m.isNew ? 0 : m.internalId,
          packingId: m.packingId,
          quantity: m.packingQuantity,
          contentId: m.contentId,
          lineReferenceId: m.lineReferenceId
        };
      }),
    };
    return postData;
  }

  private acceptFlowDataCreator(flow: Florder) {
    const cleanValue = (val) => (val && val.trim()) ? val.trim() : undefined;
    const postData = {
      flowType: flow.flowType,
      flowDate: flow.flowDate,
      customerRefNumber: flow.customerRefNumber,
      etmOrderNumber: flow.etmOrderNumber,
      salesOrderNumber: flow.salesOrderNumber,
      deliveryNumber: flow.deliveryNumber,
      shipmentNumber: flow.shipmentNumber,
      senderRefNumber: flow.senderRefNumber,
      fromId: flow.from.id,
      toId: flow.to.id,
      transporter: flow.transporter,
      clearing: flow.clearing,
      licensePlate: flow.licensePlate,
      comments: flow.comments,
      wholesalerId: flow.wholesalerId,
      Test: false,
      updateTime: flow.updateTime,
      updateDate: flow.updateDate,
      updateBy: flow.updateBy,

      LineItem: flow.flowLineItems.map(item => {
        return {
          itemNumber: item.isNew ? 0 : item.itemNumber,
          packingId: item.packingId,
          packingStatus: cleanValue(item.packingStatus),
          quantity: flow.editOriginalQuantity ? item.originalQuantity : item.definitiveQuantity,
          contentId: item.contentId,
          lineReferenceId: item.lineReferenceId
        };
      }),
    };
    return postData;
  }

  getFlowDocument(etmOrderNumber: string) {
    return this.restService.getBlobData(`/Flow/getFlowDocument?EtmOrderNumber=${etmOrderNumber}`);
  }

  getLatestFlows(activeCustomerId: string): Observable<FlordersTO> {
    this.restService.customerId = activeCustomerId;
    return this.restService.get<FlordersTO>(`/Flow/Latest?CustomerId=${activeCustomerId}`);
  }

  getFlowTypes(activeCustomerId: string): Observable<any> {
    this.restService.customerId = activeCustomerId;
    return this.restService.get<any>(`/Customer/getFlowTypes?date=${util.formatDate(new Date())}&CustomerId=${activeCustomerId}`);
  }
}

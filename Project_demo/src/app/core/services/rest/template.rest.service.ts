import { Injectable } from '@angular/core';
import { TemplateType } from 'app/core/store/template/template.interface';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { AvailablePickingDates, FlorderDetail } from '../../store/florder-detail/florder-detail.interface';
import { OrderRestService } from './order.rest.service';
import { default as cachedTemplate } from './responses/getTemplate';
import { default as cachedTemplates } from './responses/getTemplates';
import { RestService } from './rest.service';

@Injectable()
export class TemplateRestService extends OrderRestService {
  constructor(restService: RestService) {
    super(restService);
  }

  getTemplates(type: TemplateType): Observable<any> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getTemplates');
      return Observable.of(cachedTemplates);
    } else {
      return this.restService.get<any[]>(`${this.getTypePath(type)}/listTemplates`).map(templates => {
        return [...templates.map(this.templateMaterialMapper)]
      });
    }
  }

  getTemplate(type: TemplateType, templateId: number): Observable<any> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getTemplate');
      return Observable.of(cachedTemplate);
    } else {
      const url = `${this.getTypePath(type)}/getTemplate?Id=${templateId}`;
      return this.restService.get<any>(url).map(this.templateMaterialMapper);
    }
  }

  createTemplate(type: TemplateType, florderDetail: FlorderDetail): Observable<FlorderDetail> {
    const postData = this.createPostData(florderDetail);
    const url = `${this.getTypePath(type)}/createOrUpdateTemplate`;
    return this.restService.post<FlorderDetail>(url, postData);
  }

  deleteTemplate(type: TemplateType, templateId: number): Observable<any> {
    return this.restService.post<any>(`${this.getTypePath(type)}/deleteTemplate`, {
      id: templateId
    }).map(res => JSON.parse(res._body));
  }

  getTemplateOrderDeliveryDates(template, startDate: string): Observable<AvailablePickingDates> {
    let url = `/Order/getDeliveryDates?` +
      `OrderType=${template.data.orderType}&` +
      `FromId=${template.data.fromId}&` +
      `ToId=${template.data.toId}&` +
      `Transport=${template.data.transport}&` +
      `NumberOfMonths=2`;
    if (startDate != null) url += `&StartDate=${startDate}`;
    return this.restService.get<AvailablePickingDates>(url);
  }

  getTemplateRelocationUnloadingDates(template, startDate: string): Observable<AvailablePickingDates> {
    let url = `/Relocation/getLoadingDates?` +
      `FromId=${template.data.fromId}&` +
      `ToId=${template.data.toId}&` +
      `NumberOfMonths=2`;
    if (startDate != null) url += `&StartDate=${startDate}`;
    return this.restService.get<AvailablePickingDates>(url);
  }

  protected createPostData(orderDetail: FlorderDetail): any {
    return {
      id: orderDetail.templateId,
      name: orderDetail.templateName,
      data: {
        ...super.createPostData(orderDetail),
        fullTruck: orderDetail.fullTruck,
        from: orderDetail.deliveryMethod.from,
        to: orderDetail.deliveryMethod.to,
        requestedUnloadingDates: null,
        requestedUnloadingDate: null
      }
    };
  }

  private templateMaterialMapper(template) {
    let internalId = 0;
    return {
      ...template,
      data: {
        ...template.data,
        lineItem: template.data.lineItem.map(li => {
          return {
            ...li,
            internalId: internalId++,
            type: (li.palletId && li.packingId && 'combination') || (li.palletId && 'pallet') || 'packing',
          }
        })
      }
    }
  }

  private getTypePath(type: TemplateType): string {
    switch (type) {
      case 'ORDER':
        return '/Order';
      case  'RELOCATION':
        return '/Relocation';
    }
    throw new Error(`Template type ${type} not implemented`);
  }
}

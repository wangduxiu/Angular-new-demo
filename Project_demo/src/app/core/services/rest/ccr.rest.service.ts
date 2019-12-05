import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { FlorderDetail } from '../../store/florder-detail/florder-detail.interface';

@Injectable()
export class CCRRestService {
  constructor(private restService: RestService) {
  }

  private createPostData(florderDetail:FlorderDetail) {
    const cleanValue = (val) => (val && val.trim()) ? val.trim() : undefined;
    const postData = {
      etmOrderNumber: florderDetail.etmOrderNumber,
      salesOrderNumber: florderDetail.salesOrderNumber,
      deliveryNumber: florderDetail.deliveryNumber,
      shipmentNumber: florderDetail.shipmentNumber,
      sealNumber: florderDetail.sealNumber,
      lineItem: florderDetail.ccr.ccrLineItems.map(m => {
        return {
          lineType: m.type,
          palletId: m.type !== 'packing' ? cleanValue(m.palletId) : undefined,
          packingId: cleanValue(m.packingId),
          packingStatus: cleanValue(m.packingStatus),
          logisticsVarietyPacking: cleanValue(m.logisticsVarietyPacking),
          packingsPerPallet: m.ccrPackingsPerPallet || m.packingsPerPallet,
          numberOfPallets: m.ccrNumberOfPallets || m.numberOfPallets,
          packingQuantity: m.ccrPackingQuantity || m.packingQuantity || parseInt(m.packingsPerPallet, 10) * parseInt(m.numberOfPallets, 10),
        };
      }),
    };
    return postData;
  }

  createCCR(florderDetail:FlorderDetail): Observable<FlorderDetail> {
    const postData = this.createPostData(florderDetail);
    return this.restService.post<FlorderDetail>('/Ccr/create', postData);
  }

}

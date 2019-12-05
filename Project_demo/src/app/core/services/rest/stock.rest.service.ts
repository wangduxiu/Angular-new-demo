import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { StockFilter } from '../../store/stock/stock-filter.interface';
import { PowerBIConfig, StockItem } from '../../store/stock/stock.interface';
import { util } from '../../util/util';
import { default as cachedStock } from './responses/getCurrentStockList';
import { RestService } from './rest.service';

@Injectable()
export class StockRestService {
  constructor(private restService: RestService) {
  }

  getStock(filter: StockFilter): Observable<{ totalItems: number; items: StockItem[] }> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getCurrentStockList');
      return Observable.of(cachedStock);
    } else {
      const params = this.getQueryParams({}, filter);
      return this.restService.get<{ totalItems: number; items: StockItem[] }>(`/Stock/getCurrentStockList?${params}`);
    }
  }

  getPowerBIUrl(): Observable<PowerBIConfig> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getCurrentStockList');
      return Observable.of({
          loaded: true,
          loading: false,
          'id': '8828b85f-d674-4e84-ac93-4132adc86b9b',
          'embedUrl': 'https://app.powerbi.com/reportEmbed?reportId=8828b85f-d674-4e84-ac93-4132adc86b9b&groupId=014772f6-f3e9-479a-8a42-ab547f3e5bb8',
          'embedToken': {
            'token': 'H4sIAAAAAAAEACWWxQ7sWBIF_-VtPZKZRuqFmanM3pmZsdyaf59q9Trv6uS5Efn3Hzv9DnNa_PnvH-uBNQhcWJc9Jhyw06k7xAEtbSDDmGbtpuQpRzEWRJr1NELFS9Ipy9yElsN4EZWBq_eLERQYzUMezdQ0RDU0Bso-Off8UdShGTBbDoRnPvYMs3v98YotGOCQ4ML4OigbAoXEFgPLL6enNnHolRwpTccUkfZPAikyDlXfxEzeEHPbMCSFnKjsQGsALt2lAlY1OWbp9ikR9KW5-O0czZb2pYK7Z5NhoB34lIVNiBI2vAA0iI63AGg9gSZJP9Ev-zx9g5Z21fYMzF10PVB6zF5Q7eLt6CT4xY994rNTvRHuyg6NMf-FKPNMbxnhV50BzaRjlS-_oKmvFtEQEBroukubdq0i24YxKmN2MQxTV05zCaW-jFFjsKO_GixJZJsqDSZNjVJeGW2DpPPBgnm700vhbfbVxY6SGy8xtsQC-yt7adcpi4VGr-feYmhxnqvicUfjIkQx3QO4BCKRaUUu7KaHfDTonBEYBkVejtoj0InOxuII2DfHYhxZjEMgFjOlcAFaj-ZZs8FYRb_ybnO2_uEcWm8b3xUkdJFfVg2M66PnMTSGtFHOwWv0Zw4OBPGNh72tv02QW6NOV4WbF3BrjGeV2hA3ARw7wvznTi1EypNclQ97WpyquEIM9gIlg99fv3pIgizT4G5diEHyxhUT07JK6xrBka58Dx59EnZMTQYRScGswGXilu_yrXxha6mKyXFKJFMsFyBYtvhQf-cH7eCgMEyKM2KHuymwp3zQmm_ZDLAAYHFPr3VwEIJY2vi9dD-NN_jyTmrL9GEUfCeH2JXE-2A2-kxJKl0MfjxnL6cDKFuC7y09tRiINZghnF9qsrbMGsSmgHYp6aJslBsg4y0SfLNhEIz2yiUbGXr4kR07q2mEOiizuKMbBTN5kvJyLcBgkGBEdLaP4RsV7m4GbcxbBjJ3x4Bw4h0bccTO6-ELHxeYkYrQZbpoMprlBqpN8OmTM3eOn6DP52MMK5Q5g-6txsnW2Q13IaT8VsQlgl0Q3B7FxFOzxvaEEGP-LYePeCclEXuPrPkimqMSfQ5wOTvIjQtMinzBTl8ccusnKMmr4Qgfzb1ztI5NJDRi2kGzhm3S-3ohFavhLcqFD1gTK4uHxqmPDr5nvol8bfUk8C-Y7gONTQJvU48U00Lqwqkby4KRCDkTopWObugT1txEQ_pefvduEHSREkeJlRwnIDn1jYHm1VHNBdlvtsorhu_912RvbdM-Qz0-t2uHFUslfkJiqMK_xELHKM9CI038ILaH846_r31-6Zid8y-ki_SgOB9zSzNrMcSY6uxLfbZ2PAIBrwD9MX5dded2b5K29yNv-TEHKFpyhaBV4AzkPJg8Fzbu_kDMpxaxGAcnRO7xZDsdxiy_m3-gZPM8iYqxeZJK7coccQlFZa0aA4gi1j1KWEQZHKBASaTtWj2YAibO6ofcqZozshwNnSijb8Gum-3UH_KyOiPOYvFsV9WiiqyMWGeuD47FP0SUVmemauzq_ViGH6YodhpywqSmQ5A7S1reWnOmSxnIHyf4sX9TRQzyHsh8WTQTlLA-rx-y7Rv3E5E_K6DwavyeQ60mONozfK4SYVA7O3sZX2EDVcU3bbbxw3AOEwuqmPtcZywJYVaA5QUdiUmkj44-66argzWdqv5ixyDNlvrRxik6-LpAWb62eJU7WyJsqnzPUFIdp3JzohPd7R-hnvwpBdPDLCrZDe9S4FNT6TXobYsRYkMBr1MQ7Fh_q-BnCsGcBs6LQ5TZzWGw2sTrhGDQb4YVEduZgOLjJH6IFMt0XrWktY_fXbQAkowitDfpTOSRFfKFUsqdSZs3yJzLTvMNBvUbM_XcBpvok63fZYv29KPhbL9NYTYybGMlUO4uuQckMRYuNhC8kpU37N3kZS3J9oCrNkQ1TlDsAB275e1V2BEfLi7sL3m_mZaT3tv7PPeudzfsWo31dYj1poPHMOkqQXqJca5N7eFPnB8Fd3u8E5N-Dzfo3qveoHYd7YyxWvWcUoatDTMePUiMKGBS-It1r49H-KFIt83yBkcNnq0A_0TksAYgHHLMz13oPCfpZcaEDKZ1F0qu0iHaO8V7-r6dStR3yDssl6jbMQxP-7jA-vsw_niPyUDDR26zgUSJBJwFQ4C4kOQoa21b9D00ih9ILfPXX3_-84fbvssxa-X3nzPj_MS9lODMPlauABBXsIOE24QjZpsWZYeXAn3Nkr2YbIQpQlkavtFnjATXQ5K-SBWzJScTeYQ_b673cL--hWWknEcey-exDIgPCym_RKgsbrd_3JHRGffwMifWdIeEVZTbJJw1wA1josy8fvBg76Y5WfXJ_be4Ed3EjimZVncC9n3FfPERSQSUg0MQ358Sxdcs3ZJFY2SB4C-ZitkSMstoPybWW8OcdFUsPcksU4jvfWSugQaB41a6LxevVAZrpd7fQEyegrdVfKbiXAzFukHgBbMmIZEFJCEnLypy9VyrWFls4i4IMADPBhOaSoniTxowSvgrTHYq4lqDcx_scpeV9b8xf5em3JTglzIUAiOfi2YRySlPTSZliq717zLctp7S49zK3zP7ol0JlM15upvV0jwRoFFpyZIiPNEjHaHLftzlbh1jgTjQpa479vuWLWnfc4zbalUAMqvDM4b1PcuFARMEKGqtALAmSfifn-pfmpEXndFgvxYR4wwwlFDKLTGOURw8Iy_iKB0_qT3HH0e-s_5yf4wgp-uptSx2R2812H6eZymwMInJWnIyk9phdg_YQ6jGgvi9Cy5HaZ7FY66Ra57fYSNBcIZdgw-oZ1_QOWdNyIuRswiRvDVqDLlHNlqfhV2ifNpLHIA77efoXJR1PmO6enOylVMBfUn348b7yIe7zxZINMKplkbN9fPhqj6ksK8l11gBpT3clVc6Dl17hNdyZXuP8k_M__s_m1GhkVoLAAA=',
            'tokenId': '70dc03f2-36c9-47f5-986f-a5a7b7f30aa7',
            'expiration': '2018-03-16T09:22:43Z'
          },
          'minutesToExpiration': 59,
          'isEffectiveIdentityRolesRequired': true,
          'isEffectiveIdentityRequired': true,
          'enableRLS': false,
          'username': 'kjh',
          'roles': 'jhj',
          'errorMessage': null
        }
      );
    } else {
      return this.restService.get('/Report/get');
    }
  }

  private getQueryParams(params: any, filter: StockFilter) {
    const newParamsObject = {
      ...params,
      ShipTo: filter.location,
    };
    return util.serializeObjectToParams(newParamsObject);
  }

  getCustomerStock(activeCustomerId: string): Observable<{PackingAmount: number, PalletAmount: number}> {
    this.restService.customerId = activeCustomerId;
    return this.restService.get<{PackingAmount: number, PalletAmount: number}>(`/Customer/getCustomerStock?CustomerId=${activeCustomerId}`);
  }
}

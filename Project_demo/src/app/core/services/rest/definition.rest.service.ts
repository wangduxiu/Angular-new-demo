import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { DefinitionsTO } from '../../store/definitions/definitions.interface';
import { default as cachedResponse } from './responses/getDefinitions';
import { RestService } from './rest.service';

@Injectable()
export class DefinitionRestService {

  constructor(private restService: RestService, private translate: TranslateService) {
  }

  getDefinitions(language: string): Observable<DefinitionsTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getDefinitions');
      return Observable.of(cachedResponse as DefinitionsTO);
    } else {
      return this.restService.get<DefinitionsTO>(`/Definition/get?language=${(language || 'en').toUpperCase()}`);
    }
  }

}

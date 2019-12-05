import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../../app.settings';
import { AdminDefinitionsTO } from '../../../store/admin/admin-definitions/admin-definitions.model';
import { RestService } from '../rest.service';
import { default as cachedResponse } from './responses/getAdminDefinitions';

@Injectable()
export class AdminDefinitionRestService {

  constructor(private restService: RestService, private translate: TranslateService) {
  }

  getAdminDefinitions(language: string): Observable<AdminDefinitionsTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getAdminDefinitions');
      return Observable.of(cachedResponse as AdminDefinitionsTO);
    } else {
      return this.restService.get<AdminDefinitionsTO>(`/Definition/getAdmin?language=${(language || 'en').toUpperCase()}`);
    }
  }
}

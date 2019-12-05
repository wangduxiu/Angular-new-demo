import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { UserContextTO } from '../../store/user-context/user-context.interface';
import { AdalService } from '../adal/adal.service';
import { default as cachedResponseEpsUser } from './responses/getUserContextEpsUser';
import { RestService } from './rest.service';

@Injectable()
export class UserContextRestService {

  constructor(private restService: RestService, private adalService: AdalService) {
  }

  getUserContext(): Observable<UserContextTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getUserContext');
      return Observable.of(cachedResponseEpsUser as UserContextTO);
    } else {
      return this.restService.get('/User/context');
    }
  }
}


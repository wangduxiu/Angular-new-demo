import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Observable } from 'rxjs/Observable';
import { AdalService } from '../adal/adal.service';

@Injectable()
export class I18nRestService {

  constructor(private restService: RestService, private adalService: AdalService) {
  }

  getCheckedInTranslations(lang: string): Observable<any> {
      return this.restService.get(`/locale/${lang.toLocaleLowerCase()}.json`, true, true);
  }
  getServerTranslations(lang: string | string[]): Observable<any> {
    if (Array.isArray(lang)) {
      const observables = (lang as string[]).map(language => this.restService.get(`/Translation/get?id=${language.toLocaleLowerCase()}`));
      return Observable.forkJoin(observables);
    } else {
      return this.restService.get(`/Translation/get?id=${lang.toLocaleLowerCase()}`).catch(error => {
        return Observable.of(null);
      });
    }
  }

  saveOrUpdateTranslations(lang: string, translations: any): Observable<any> {
    return this.restService.post('/Translation/createOrUpdate', {id: lang.toLocaleLowerCase(), json: translations});
  }
}


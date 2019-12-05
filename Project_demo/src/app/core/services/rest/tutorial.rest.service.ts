import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestService } from './rest.service';

@Injectable()
export class TutorialRestService {
  constructor(protected restService: RestService) {
  }

  hideTutorial(): Observable<any> {
    return this.restService.post<any>('/User/deactivateTutorial', true);
  }

}

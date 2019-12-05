import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import {ContractDetailsRestService} from '../../../core/services/rest/contract-details.rest.service';
import {ReplaySubject} from 'rxjs';

export interface ValidationParams {
  required: boolean;
  unique: boolean;
  mask: string;
  senderRefNumber: string;
  fromId: string;
  toId: string;
  etmOrderNumber: string;
}

interface RestCallParams extends ValidationParams {
  poNumber: string;
}

interface AsyncValidationFunction {
  (c: FormControl): Observable<null | { custom?: { message: string }, invalid?: boolean }>;
}

@Injectable()
export class PoNumberAsyncValidator {

  private restCall: Observable<{ success: boolean, message: string }>;
  private restCallResponse: { success: boolean, message: string };
  private previousParams: RestCallParams;

  constructor(private contractDetailsRestService: ContractDetailsRestService) {
  }

  getRestCall(params: RestCallParams): Observable<null | { success: boolean, message: string }> {
    const subject = new ReplaySubject<null | { success: boolean, message: string }>();
    if (!this.previousParams || this.previousParams.required !== params.required || this.previousParams.unique !== params.unique || this.previousParams.mask !== params.mask || this.previousParams.poNumber !== params.poNumber || this.previousParams.toId !== params.toId || this.previousParams.fromId !== params.fromId || this.previousParams.senderRefNumber !== params.senderRefNumber || this.previousParams.etmOrderNumber !== params.etmOrderNumber) {
      this.contractDetailsRestService.validatePoNumber(params).subscribe(result => {
        this.restCallResponse = result;
        this.previousParams = params;
        subject.next(this.restCallResponse);
        subject.complete();
      });
    } else {
      subject.next(this.restCallResponse);
      subject.complete();
    }
    return subject.asObservable();
  }

  doValidation(params: RestCallParams): Observable<{ success: boolean, message?: string }> {
    const subject = new ReplaySubject<{ success: boolean, message?: string }>();
    try {
      if (!params.poNumber) {
        if (params.required) {
          subject.next({ success: false, message: 'Required' });
          subject.complete();
        } else {
          subject.next({success: true});
          subject.complete();
        }
      } else {
        const observable = this.getRestCall(params);
        observable.subscribe(response => {
          subject.next({ success: response.success, message: response.message });
          subject.complete();
        })
      }
    } catch (e) {
      logger.error(e);
      subject.error(e);
    }
    return subject.asObservable();
  }
}

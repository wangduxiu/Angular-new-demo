import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TranslationHelperService {

  constructor(private translateService: TranslateService) {}

  translateArray<T>(array: string[], reducer: (value: string, translatedValue: string, index: number) => T, translationCodePrefix ?: string): Observable<T[]> {
    const translationCodes = array.map(value => (translationCodePrefix || '') + value);
    return Observable.create((observer) => {
      this.translateService.get(translationCodes).subscribe((translatedValues: string[]) => {
        observer.next(array.map((value, idx) => reducer(value, translatedValues[(translationCodePrefix || '') + value], idx)));
        observer.complete();
      });
    });
  }

  translateArrayInstant<T>(array: string[], reducer: (value: string, translatedValue: string, index: number) => T, translationCodePrefix ?: string): T[] {
    const translationCodes = array.map(value => (translationCodePrefix || '') + value);
    const translatedValues = this.translateService.instant(translationCodes);
    return array.map((value, idx) => reducer(value, translatedValues[(translationCodePrefix || '') + value], idx));
  }

  /**
   * Translate string codes and return translations in an object with key = code & value = translation
   * @param {string[]} array string-codes to be translated
   * @param {string} translationCodePrefix translationCodePrefix.  Will not be used to store in object
   * @returns {any} Observable that will return an object with translations
   */
  translateArrayToObject(array: string[], params?: any, translationCodePrefix ?: string): Observable<{[key: string]: string}> {
    const translationCodes = array.map(value => (translationCodePrefix || '') + value);
    return Observable.create((observer) => {
      this.translateService.get(translationCodes, params).subscribe((translatedValues: string[]) => {
        observer.next(array.reduce((res, value) => {res[value] = translatedValues[(translationCodePrefix || '') + value]; return res;}, {}));
        observer.complete();
      });
    });
  }
}

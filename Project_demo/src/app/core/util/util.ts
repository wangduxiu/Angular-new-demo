import { EventEmitter } from '@angular/core/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { IMyDate } from 'mydatepicker-selectweek';
import * as _ from 'typedash';
import { AppSettings } from '../../app.settings';
import { Definition } from '../store/definitions/definition.interface';
import { Place } from '../store/florders/place.interface';
import { ErrorMessage } from './error.interface';

const integerReg = /^[-]?\d+$/;

const numericValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } => {
  return util.isNumeric(control.value) ? null : { 'notANumber': { value: control.value } };
};

export class util {
  static BLANK = ' '; // Must be 'true' when == , so don't use '' because it's resolved to false AS IN SELECT.COMPONENT.TS !!!

  static serializeObjectToParams(obj, prefix: string = '', usePrefixes: boolean = false) {
    const str = [];
    let p;
    let k;
    let v;
    // the splitting of arrays wasn't happening correctly, the only way an obj === 'string' is when
    // it has an
    if (typeof obj === 'string') {
      return encodeURIComponent(prefix) + '=' + encodeURIComponent(obj);
    } else {
      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          k = usePrefixes && prefix ? prefix + '.' + p : p;
          v = obj[p];
          if (v !== null && v !== undefined) {
            //detect if array
            if (Array.isArray(v)) {
              // if array then recursive call function -> in this case the obj will be a string
              for (let index = 0; index < v.length; index++) {
                const element = v[index];
                str.push(this.serializeObjectToParams(element, k, usePrefixes));
              }
            } else {
              str.push(v !== null && typeof v === 'object' && !(v instanceof Date) ? this.serializeObjectToParams(v, k, usePrefixes) : encodeURIComponent(k) + '=' + encodeURIComponent(v),);
            }
          }
        }
      }
    }

    return str.join('&');
  }

  /**
   * Returns a deep copy of the object
   */

  static deepCopy(oldObj: any) {
    let newObj = oldObj;

    if (oldObj) {
      if (oldObj instanceof Date) {
        newObj = new Date();
        newObj.setTime(oldObj.getTime());
      } else if (typeof oldObj === 'object') {
        newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
        for (const i in oldObj) {
          newObj[i] = this.deepCopy(oldObj[i]);
        }
      }
    }
    return newObj;
  }

  static jsonDeepCopy = <T>(o: T): T => {
    if (!o) {
      return o;
    }
    return JSON.parse(JSON.stringify(o));
  };

  private static isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  private static isPlainObject(obj) {
    return this.isObject(obj) && (
      obj.constructor === Object  // obj = {}
      || obj.constructor === undefined // obj = Object.create(null)
    );
  }

  static deepMerge(target, ...sources) {
    return this._deepMerge(target, 1, ...sources);
  }

  // Added depth to analyse delhaize contract issue
  private static _deepMerge(target, depth, ...sources) {

    // Stop if no sources
    if (!sources.length) {
      return;
    }

    for (const source of sources) {
      if (Array.isArray(target)) {
        if (Array.isArray(source)) {
          // Merge based on id
          for (const elem of source) {
            if (elem.id) {
              const targetElem = target.find(e => e.id === elem.id);
              if (targetElem) {
                this._deepMerge(targetElem, depth + 1, elem);
              } else {
                target.push(this.deepCopy(elem));
              }
            } else {
              target.push(this.deepCopy(elem));
            }
          }
        } else {
          target.push(this.deepCopy(source));
        }
      } else if (this.isPlainObject(target)) {
        if (this.isPlainObject(source)) {
          for (const key of Object.keys(source)) {
            if (!target[key]) {
              target[key] = this.deepCopy(source[key]);
            } else {
              this._deepMerge(target[key], depth + 1, source[key]);
            }
          }
        } else {
          throw new Error(`Cannot merge object with non-object`);
        }
      } else {
        target = source;
      }
    }
  }

  private static getControl(form: FormGroup, nameOrFunction: Function | string) {
    if (typeof nameOrFunction === 'function') {
      return nameOrFunction(form);
    } else {
      return form.get(nameOrFunction as string);
    }
  }

  static getNumericValidator(): ValidatorFn {
    return numericValidator;
  }

  static isNumeric(val: string): boolean {
    return integerReg.test(val);
  }

  /**
   * Create a condition
   * @param {Function|string} conditionControl  name or function of control on which to depend, control can contain a boolean or a string as value.  If string, 'dependingValuesArray' is required
   * @param {any[]|any} conditionValues   possible values for the 'depending on'-controll
   * @returns {{conditionControl: (Function|string); conditionValues: (any[]|any)}}
   */
  static createCondition(conditionControl: Function | string, conditionValues: any[] | any = [true], conditionValueGetter?: Function): { conditionControl: Function | string; conditionValues?: any[], conditionValueGetter?: Function } {
    if (!Array.isArray(conditionValues)) {
      conditionValues = [conditionValues]; // tslint:disable-line no-param-reassign
    }
    return { conditionControl, conditionValues, conditionValueGetter };
  }

  /**
   * @param form form that contains the controls
   * @param targetControl name or function of control that needs this validation
   * @param conditions: array of conditions
   * @param validatorsWhenMet initial validators
   */
  static conditionalValidation(
    form: FormGroup, targetControl: Function | string,
    conditions: { conditionControl: Function | string; conditionValues?: any[]; conditionValueGetter?: Function }[],
    validatorsWhenMet: ValidatorFn[],
    validatorsWhenNotMet: ValidatorFn[] = []
  ) {
    const control: FormControl = this.getControl(form, targetControl);

    const conditionsAreMet = () => {
      return conditions.reduce((conditionIsMet, condition) => {
        if (conditionIsMet === false) {
          return false;
        }
        const dependingOnControl = this.getControl(form, condition.conditionControl);
        const dependingOnValue = condition.conditionValueGetter ? condition.conditionValueGetter(dependingOnControl) : dependingOnControl.value;
        const conditionValues = condition.conditionValues || [true];
        return !!conditionValues.find(v => typeof v === 'boolean' && !!dependingOnValue || v === dependingOnValue); // If boolean, then everything that is true-ish is ok
      }, true);
    };

    const checker = () => {
      if (conditionsAreMet()) {
        control.setValidators(validatorsWhenMet);
      } else {
        control.setValidators(validatorsWhenNotMet);
        // control.clearValidators();
      }
      control.updateValueAndValidity();
    };

    conditions.forEach(condition => {
      const dependingOnControl = this.getControl(form, condition.conditionControl);
      dependingOnControl.valueChanges.subscribe(checker);
    });
    checker();
  }

  /**
   * Helper method to find all errors on controls
   * @param form form (or formGroup) to iterate on
   * @param errors empty array to start with.  Optional
   * @returns {Array} array of errors found
   */
  static getFormValidationErrors(form: FormGroup, errors = []) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        this.getFormValidationErrors(control, errors);
      }
      const controlErrors: ValidationErrors = control.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          errors.push('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
    return errors;
  }

  static formatDate(date: Date) {
    const value = { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
    return moment(value).format(AppSettings.DATE_FORMAT_MOMENT_REST);
  }

  static parseDate(date: string): Date {
    const dateMoment = moment(date, AppSettings.DATE_FORMAT_MOMENT_REST);
    return dateMoment.toDate();
  }

  static isMobile(): boolean {
    const { innerWidth } = window;
    return innerWidth < 760;
  }

  static isDesktop(): boolean {
    return this.deviceType() === 'desktop';
  }

  static deviceType(): string {
    if (innerWidth < 440) {
      return 'mobile';
    } else if (innerWidth < 770) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  static localizeDateString(dateAsString: string): string {
    try {
      const date = dateAsString && util.parseDateString(dateAsString);
      date.month = date.month - 1;
      return date && moment(date).format(AppSettings.DATE_FORMAT_MOMENT) || dateAsString;
    } catch (e) {
      return dateAsString;
    }
  }

  static getDefaultDefinition(definitions: Definition[]): Definition {
    return definitions.find(def => def.defaultValue);
  }

  static getValueId(value: string | { id: string, name: string }, valueAsObject: boolean = false): string {
    if (!value) {
      return valueAsObject ? null : '';
    }
    if (value['id']) {
      return (value as { id: string; name: string }).id;
    }
    return value as string;
  }

  /**
   * Helper method to create a list of items that can be used in a select field.
   * @param {T[]} children                        All children to include.  Optional.  When set, selectedId, containerArray childSelector are ignored
   * @param {string} selectedId                   ID of parent that is selected  (eg. orderType).  Ignored if children is set
   * @param {any[]} containerArray                List of all possible parents (eg. list of orderTypes).  Ignored if children is set
   * @param {(any) => T[]} childSelector          Method to select the array of children that will be used in the response.  Ignored if children is set
   * @param {AbstractControl | AbstractControl[]} childControls  Child control or array of child controls that will possibly be used to set the value (all or blank) if appropriate
   * @param {boolean} defaultAll                  If current selected value is not a valid value, set to 'all' (defaultAll=true) or Select.BLANK (defaultAll=false)
   * @param {boolean} returnObject                If true, value is an object {id: string, name: string}, otherwise it's a string (id)
   * @param {Function} cascade                    When finished, execute this function (eg orderType -> setFroms -> setTos
   * @param {Function} getTitle                   Function (optional) to generate a function to be used (eg address for from/to)
   * @param {Function} setter                     Sets the result using the setter.  Sometimes it needs to be set before doing a cascade
   * @param {boolean} sort                        Alphabetically sort the list
   * @returns {{id: any; name: any; title: (Function | any)}[]}  an array of definitions (id, name, title?) to be used in a app-select form element
   */
  static setSelectElements<T>({ children, selectedId, containerArray, childSelector, childControls, defaultAll, cascade, getTitle, setter, returnObject, sort }: {
    selectedId?: string;
    containerArray?: any[];
    children?: T[];
    childSelector?: (any) => T[];
    childControls: AbstractControl | AbstractControl[];
    defaultAll?: boolean;
    cascade?: Function;
    getTitle?: Function;
    setter?: Function;
    returnObject?: boolean;
    sort?: boolean;
  }) {
    const temp = children
      || _.compact(containerArray)
        .filter(element => selectedId === 'all' || element && selectedId === element['id'])
        .map(childSelector)
        .reduce((res, array) => {
          res.push(...array);
          return res;
        }, []);
    let elements = temp.map(child => {
      return {
        id: child['id'], name: child['name'] || child['id'], title: getTitle && getTitle(child), hidden: !!child['hidden']
      };
    });

    if (!Array.isArray(childControls)) {
      childControls = [childControls];
    }

    // First filter out the duplicates
    const uniqIds = _.uniq(elements.map(e => e.id));
    elements = uniqIds.map(id => elements.find(e => e.id === id));

    childControls.forEach(childControl => {
      if (!elements.find(e => e.id === util.getValueId(childControl.value, returnObject))) {
        // invalid value or no value
        if (defaultAll) { // If no value, default to ALL, set value to ALL
          childControl.setValue(returnObject ? { id: 'all', name: 'All' } : 'all');
        } else if (elements.length === 1) { // If only 1 valid element, use that value
          childControl.setValue(returnObject ? elements[0] : elements[0].id);
        } else { // Set empty value
          childControl.setValue(returnObject ? null : this.BLANK);
        }
      }
    });

    if (sort) {
      elements.sort(this.nameSorter());
    }

    // Set elements first, before cascade
    setter && setter(elements);

    cascade && cascade.apply(this);

    return elements;
  }

  /**
   * Returns a new object with all properties with null or undefined value removed
   * @param object source
   * @returns new object with no null or undefined properties
   */
  static removeNullOrUndefined = object => {
    return Object.keys(object).reduce((o, key) => {
      let value = object[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value = value.map(v => util.removeNullOrUndefined(v));
        } else if (typeof value === 'object') {
          value = util.removeNullOrUndefined(value);
        }
        o = Object.assign({}, o, { [key]: value });
      }
      return o;
    }, {});
  };

  static parseDateString(date: string) {
    const m = /(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (m) {
      return {
        year: parseInt(m[1], 10), month: parseInt(m[2], 10), day: parseInt(m[3], 10),
      };
    }
    return null;
  }

  static convertDateStringToMyDate(date: string): IMyDate {
    const m = /(\d{4})-(\d{2})-(\d{2})/.exec(date);

    return {
      year: parseInt(m[1], 10),
      month: parseInt(m[2], 10),
      day: parseInt(m[3], 10),
    };
  }

  static idSorter(ascending = false) {
    return (a: Definition, b: Definition) => {
      let result;
      if (!a && b) {
        result = 1;
      } else if (!b && a) {
        result = -1;
      } else if (a === b) {
        result = 0;
      } else {
        result = a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      }
      return ascending ? result : -1 * result;
    };
  }

  static nameSorter() {
    return (a: Definition, b: Definition) => {
      let result;
      if (!b && a) {
        result = -1;
      } else if (!a && b) {
        result = 1;
      } else if (a === b) {
        result = 0;
      } else if (a.id === 'all') {
        return -1;
      } else {
        result = a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      }
      return result;
    };
  }

  static sortHelper(thiz: { filter: { sortField?: string, sortAscending?: boolean }, sortChange: EventEmitter<{ sortField: string, sortAscending: boolean }> }, clickedSortField: string) {
    if (thiz.filter.sortField === clickedSortField) { // Switch between ascending / descending / no sorting
      if (thiz.filter.sortAscending === true) {
        thiz.filter.sortAscending = false;
        thiz.sortChange.emit({ sortField: clickedSortField, sortAscending: false });
      } else if (thiz.filter.sortAscending === false) {
        thiz.filter.sortField = null;
        thiz.sortChange.emit({ sortField: null, sortAscending: true });
      } else {
        thiz.filter.sortAscending = true;
        thiz.sortChange.emit({ sortField: clickedSortField, sortAscending: true });
      }
    } else {
      thiz.filter.sortField = clickedSortField;
      thiz.filter.sortAscending = true;
      thiz.sortChange.emit({ sortField: clickedSortField, sortAscending: true });
    }
  }

  static generateAddressString(locations: Place[], id: string, emptyTranslation: string) {
    const location = locations && locations.find(location => location.id === id);
    const address = location && location.address;
    if (address && (address.street || address.postcode || address.city || address.country)) {
      return `${address.street || ''} ${address.postcode || ''} ${address.city || ''} ${address.country || ''}`;
    }
    return emptyTranslation;
  }

  static getWeekNumber(date: { year: number, month: number, day: number }): number {
    const d: Date = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
    d.setDate(d.getDate() + (d.getDay() === 0 ? -3 : 4 - d.getDay()));
    return Math.round(((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000) / 7) + 1;
  }

  static getErrorMessage(error: Error): ErrorMessage {
    const err = error['error'] || error;
    let message = err['Message'] || err['statusText'] || err['message'] || err['messageCode'];
    let subMessages: string[] = err['SubMessages'] || err['subMessages'] || [];
    let object;
    try {
      object = JSON.parse(err['_body']);
      message = object.Message;
      subMessages = object.SubMessages || subMessages;
    } catch (e) {
    }
    return {
      message,
      subMessages,
      object,
      error,
    };
  }

  static openBlob(blob: Blob, filename: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      FileSaver.saveAs(new File([blob], filename));
    }
  }

  static flattenJson(data: any): any {
    const result = {};
    const recurse = (cur, prop) => {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        const l = cur.length;
        for (let i = 0; i < l; i += 1)
          recurse(cur[i], prop + '[' + i + ']');
        if (l === 0)
          result[prop] = [];
      } else {
        let isEmpty = true;
        for (const p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + '.' + p : p);
        }
        if (isEmpty && prop)
          result[prop] = {};
      }
    };
    recurse(data, '');
    return result;
  }

  static unflattenJson(data: any): any {
    if (Object(data) !== data || Array.isArray(data))
      return data;
    let result = {}, cur, prop, idx, last, temp;
    for (let p in data) {
      cur = result, prop = '', last = 0;
      do {
        idx = p.indexOf('.', last);
        temp = p.substring(last, idx !== -1 ? idx : undefined);
        cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
        prop = temp;
        last = idx + 1;
      } while (idx >= 0);
      cur[prop] = data[p];
    }
    return result[''];
  }

  static modalWindowVisible(): boolean {
    const overlayContainers = document.getElementsByClassName('cdk-overlay-container');
    const overlayContainer = overlayContainers && overlayContainers.length === 1 && overlayContainers[0];
    const visibleChildren = !!(overlayContainer && overlayContainer.children && Array.from(overlayContainer.children).find(c => c.clientWidth > 0 && c.clientHeight > 0));
    return visibleChildren;
  }
}


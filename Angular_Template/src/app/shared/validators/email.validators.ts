import { AbstractControl } from '@angular/forms';

/**
 * Validator for email inputs
 */
export class EmailValidators {
  static inValid(control: AbstractControl): { [key: string]: any } {
    const error = { invalid: true };
    if (!control.value) {
      return error;
    }
    const regEmail1 = '^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|';
    const regEmail2 =
      '(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|';
    const regEmail3 = '/(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$';
    return new RegExp(regEmail1 + regEmail2 + regEmail3).test(control.value)
      ? null
      : error;
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  getConfig() {
    return window['config'];
  }
}

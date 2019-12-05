import { Injectable } from '@angular/core';
import { ConfigService } from '../../config/config-service';

@Injectable()
export class AdalConfigService {
  private config: any;

  constructor(config: ConfigService) {
    this.config = config.getConfig();
  }

  public get adalConfig(): any {
    return {
      clientId: this.config.ClientId,
      tenant: this.config.Tenant,
      resource: this.config.Resource,
      instance: this.config.Instance,
      extraQueryParameter: `realm=${this.config.Tenant}`,
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/',
    };
  }
}

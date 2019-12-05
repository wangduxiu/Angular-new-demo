import { AdalConfigService } from './adal-config.service';
import { Injectable } from '@angular/core';
import 'expose-loader?AuthenticationContext!../../../../../node_modules/adal-angular/lib/adal.js';
import { Observable } from 'rxjs/Observable';

const createAuthContextFn: adal.AuthenticationContextStatic = AuthenticationContext;

export const ADAL_401_ERROR_MESSAGE = "This user can't log in or is not activated.  Please contact your administrator.";

@Injectable()
export class AdalService {

  private context: adal.AuthenticationContext;

  constructor(private adalConfigService: AdalConfigService) {
    this.resetContext();
  }

  resetContext() {
    const adalConfig = this.adalConfigService.adalConfig;
    this.context = adalConfig && new createAuthContextFn(adalConfig);
  }

  login() {
    this.context && this.context.login();
  }

  logout() {
    this.context && this.context.logOut();
  }

  handleCallback() {
    this.context && this.context.handleWindowCallback();
  }

  public get userInfo() {
    return this.context && this.context.getCachedUser();
  }

  public acquireToken(): Observable<{ message: string, token: string }> {
    return new Observable<{ message: string, token: string }>((observer) => {
      try {
        this.context && this.context.acquireToken(this.adalConfigService.adalConfig.resource, (message: string, token: string) => {
          observer.next({ message, token });
          observer.complete();
        });
      } catch (e) {
        observer.error(e);
      }
    });

  }
  public triggerGetTokenForAcceptance(errorHandler: (o: any) => void, errorMessage?: string) {
    const getTokenForAcceptance = sessionStorage.getItem("getTokenForAcceptance");
    if (getTokenForAcceptance || getTokenForAcceptance === 'true') {
      const errorHandlingMessage = {
        status: 401,
        message: ADAL_401_ERROR_MESSAGE,
        subMessage: errorMessage,
      } || ADAL_401_ERROR_MESSAGE;
      errorHandler(errorHandlingMessage);
      return true;
    }
    sessionStorage.setItem("getTokenForAcceptance", "true");

    const url = this.context['_getNavigateUrl']('token', this.adalConfigService.adalConfig.resource);
    if (this.userInfo) {
      location.href = url;
      return true;
    }
    return false;
  }

  public get isAuthenticated(): boolean {
    return !!this.userInfo;
  }
}

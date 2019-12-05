import { Injectable } from '@angular/core';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AdalService } from '../adal/adal.service';

@Injectable()
export class RestService {

  private _customerId: string;
  private _customerIds: string[];

  constructor(private http: Http, private adalService: AdalService) {
  }


  set customerId(value: string) {
    this._customerId = value;
  }

  /**
   * Helper method for a GET request.
   * @param url
   * @returns {Observable|"../../../Observable".Observable|"../../Observable".Observable}
   */
  public get<T>(url, publicCall: boolean = false, asset: boolean = false): Observable<T> {
    return new Observable((observer) => {

      const handleError = (error: any) => {
        observer.error(error);
        observer.complete();
      };
      this.getData(url, publicCall, asset).subscribe(
        (response) => {
          observer.next(response && response['_body'] && response.json() || {});
          observer.complete();
        },
        error => {
          let errorMessage;
          try {
          let json = JSON.parse(error._body);
            errorMessage = json.Message;
          } catch (e) {
          }
          if (!error.url.endsWith('/User/context') || error.status !== 401 || !this.adalService.triggerGetTokenForAcceptance(handleError, errorMessage)) {
            handleError(error);
          }
        }
      );
    });
  }

  /**
   * Get data from middleware
   * method signatures is identical to http.get method.
   *
   * @param url
   * @param publicCall true if accessible without login
   * @returns {any}
   * @private only used internally.  Use protected 'get' method in subclasses.
   */
  private getData(url: string, publicCall: boolean = false, asset: boolean = false): Observable<Response> {
    if (publicCall) {
      return this.http.get(asset ? `/assets${url}` : `/api${url}`);
    } else {
      return Observable.create((observer) => {
        this.adalService.acquireToken().subscribe(({ message, token }) => {
          const options = new RequestOptions({ headers: new Headers({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', CustomerId: this._customerId }) });
          this.http.get(`/api${url}`, options).first().subscribe((response) => {
              observer.next(response);
              observer.complete();
            },
            error => observer.error(error));
        });
      });
    }
  }

  /**
   * Get blob data from middleware
   * method signatures is identical to http.get method.
   *
   * @param url
   * @param publicCall true if accessible without login
   * @returns {any}
   */
  getBlobData(url: string, publicCall: boolean = false): Observable<Response> {
    if (publicCall) {
      return this.http.get(`/api${url}`);
    }
    return this.getDataOfType(ResponseContentType.Blob, url);
  }

  /**
   * Get text data from middleware
   * method signatures is identical to http.get method.
   *
   * @param url
   * @param publicCall true if accessible without login
   * @returns {any}
   */
  getTextData(url: string, publicCall: boolean = false): Observable<Response> {
    if (publicCall) {
      return this.http.get(`/api${url}`);
    } else {
      return this.getDataOfType(ResponseContentType.Text, url);
    }
  }

  private getDataOfType(responseType, url: string) {
    return Observable.create((observer) => {
      this.adalService.acquireToken().subscribe(({ message, token }) => {
        const options = new RequestOptions({ headers: new Headers({ Authorization: `Bearer ${token}`, CustomerId: this._customerId }), responseType });
        this.http.get(`/api${url}`, options).first().subscribe((response) => {
            observer.next(response);
            observer.complete();
          },
          error => {
            try {
              var reader = new FileReader();
              reader.onload = function (event) {
                try {
                  return observer.error(JSON.parse(reader.result));
                } catch (e) {
                  return observer.error(error);
                }
              };
              reader.readAsText(error._body);
            } catch (e) {
              return observer.error(error)
            }
          });
      });
    });
  }

  /**
   * Based on this article: http://www.bentedder.com/upload-images-angular-4-without-plugin/
   * @param {String} url
   * @param {FormData} formData
   * @returns {Observable<Response>}
   */
  public upload(url: String, formData: FormData): Observable<Response> {
    return Observable.create((observer) => {
      this.adalService.acquireToken().subscribe(({ message, token }) => {
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('CustomerId', this._customerId );
        headers.append('Content-Type', 'multipart/form-data');
        const options = new RequestOptions({ headers: headers });
        this.http.request(`/api${url}`, {
          method: 'post',
          body: formData,
          headers: options.headers
        }).first().subscribe((response) => {
          observer.next(response);
          observer.complete();
        }, (err) => {
          observer.error(err);
          observer.complete();
        });
      });
    });
  }

  /**
   * Stub taken from http interface, to be elaborated
   * @param url
   * @param options
   * @returns {Observable<Response>}
   * @private
   */
  // tslint:disable-next-line no-unused-variable
  private request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.request(url, options);
  }

  /**
   * Stub taken from http interface, to be elaborated
   * @param url
   * @param options
   * @returns {Observable<Response>}
   * @private
   */
  // tslint:disable-next-line no-unused-variable
  post<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
    const subject = new Subject<any>();

      this.adalService.acquireToken().subscribe(({ message, token }) => {
        const options = new RequestOptions({ headers: new Headers({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', CustomerId: this._customerId }) });
        this.http.post(`/api${url}`, body, options).first().subscribe((response) => {
          subject.next(response);
          subject.complete();
        }, (err) => {
          subject.error(err);
        });
      });
    return subject.asObservable();
  }
}

import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { NotFoundError } from '../../errors/not-found.error';
import { BadInputError } from '../../errors/bad-input.error';
import { AppError } from '../../errors/app.error';
import { catchError, map } from 'rxjs/operators';

export class BaseRestService {
  constructor(private url: string, private http: HttpClient) {}

  getAll() {
    return this.http
      .get(this.url)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  getById(id: number | string) {
    return this.http
      .get(this.url + '/' + id)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  create(resource) {
    return this.http
      .post(this.url, resource)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  update(resource) {
    return this.http
      .patch(this.url + '/' + resource.id, resource)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  delete(id: number | string) {
    return this.http
      .delete(this.url + '/' + id)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return throwError(new BadInputError(error));
    }

    if (error.status === 404) {
      return throwError(new NotFoundError(error));
    }

    return throwError(new AppError(error));
  }
}

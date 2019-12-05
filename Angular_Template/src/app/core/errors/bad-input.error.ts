import { AppError } from '@app/core/errors/app.error';

export class BadInputError extends AppError {
  constructor(public orginialError?: any) {
    super(orginialError);
  }
}

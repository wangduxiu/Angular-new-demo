export class AppError extends Error {
  constructor(public orginialError?: any) {
    super(orginialError);
  }
}

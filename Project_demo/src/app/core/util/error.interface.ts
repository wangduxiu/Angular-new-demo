
export interface ErrorMessage {
  message: string;
  subMessages: string[];
  object?: any;
  error: Error;
}

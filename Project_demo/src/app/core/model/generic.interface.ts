export interface LoadState<T> {
  loading: boolean;
  loadSuccess: boolean;
  loadFailed: boolean;
  errorMessage?: string;
  data: T;
}

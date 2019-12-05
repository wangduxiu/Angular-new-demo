
export interface Modal {
  type: 'success' | 'error' | 'warning' | 'info';
  message?: string;
  messageCode?: string;
  params?: any;
  subMessages?: string[];
  title?: string;
  titleCode?: string;
  timeToDoAction?: number;
  redirectUrl: string;
  buttonText: string;
  disableClose: boolean;
  showLogout?: boolean;
  copyToClipboard?: string;
}

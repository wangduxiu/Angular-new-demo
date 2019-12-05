
import { ToastrConfig } from 'ngx-toastr';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  modal: boolean;
  message?: string;
  subMessages?: string[];
  verbose?: string;
  messageCode?: string;
  showLogout?: boolean;
  title?: string;
  titleCode?: string;
  translationParams?: any;
  options?: ToastrConfig;
  redirectUrl?: string;
  disableClose: boolean;
}

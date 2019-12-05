
import { Notification } from './notification.interface';

export const initialState: Notification = {
  type: 'info',
  message: '',
  modal: false,
  title: null,
  disableClose: false
};

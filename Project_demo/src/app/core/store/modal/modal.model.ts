
import { Modal } from './modal.interface';

export const initialState: Modal = {
  type: 'info',
  message: '',
  messageCode: '',
  subMessages: [],
  title: '',
  titleCode: '',
  timeToDoAction: null,
  redirectUrl: '',
  buttonText: '',
  disableClose: false,
};

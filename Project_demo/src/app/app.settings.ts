import {environment} from '../environments/environment';

export class AppSettings {
  static ADMIN_PAGE_SIZE: number = 50;
  static PAGE_SIZE: number = 25;
  static DEFAULT_LANGUAGE: string = 'default';
  static DEFAULT_ROUTE: string = '/dashboard';
  static PUBLIC_PAGE_ROUTE: string = '/login';
  static SELECT_CUSTOMER_ROUTE: string = 'customer/select';

  static DATE_FORMAT_ANGULAR: string = 'dd/MM/yyyy';
  static DATE_FORMAT_DATEPICKER: string = 'dd/mm/yyyy';
  static WEEK_FORMAT_DATEPICKER: string = 'week ww, yyyy';
  static DATE_FORMAT_MOMENT: string = 'DD/MM/YYYY';
  static DATE_FORMAT_MOMENT_REST: string = 'YYYY-MM-DD';

  static FLOW_STATUS_WAITING_FOR_HANDSHAKE: string = '02';

  static MATERIAL_TYPE_COMBINATION: 'combination' | 'packing' | 'pallet' = 'combination';
  static MATERIAL_TYPE_PALLET: 'combination' | 'packing' | 'pallet' = 'pallet';
  static MATERIAL_TYPE_PACKING: 'combination' | 'packing' | 'pallet' = 'packing';

  static USE_MOCK_REST_DATA = !environment.production && false; // TODO remove in production !!!
}

console.log(`Work offline: ${AppSettings.USE_MOCK_REST_DATA}`);

export function getEnvironment(): string {
  const url = document.location.href;
  if (/https:\/\/dev-/.test(url)) {
    return 'dev';
  }

  if (/https:\/\/qas-/.test(url)) {
    return 'qas';
  }

  if (/http:\/\/localhost/.test(url)) {
    return 'localhost-' + environment.environment;
  }

  return '';
}


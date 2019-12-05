import {AuthorizationMatrix, AuthorizationMatrixTO, ContractRestrictions} from 'app/core/store/contract-details/contract-details.interface';
import {Definition} from 'app/core/store/definitions/definition.interface';
import {Place} from 'app/core/store/florders/place.interface';

export interface CustomerInfo {
  loading: boolean;
  loaded: boolean;
  failed: boolean;

  customerId: string;

  authorization: AuthorizationMatrix;
  defaults: {
    localCurrency: string;
    depot: {
      id: string;
      type: string;
      address: string;
      name: string;
      openingHours: string;
    }
  };

  restrictions: ContractRestrictions;

  places: {[key: string]: Place};
  shipTos: Definition[];
  orderTypes: Definition[];
  flowRegistrationTypes: Definition[]; // Used for creating flows
  flowHandshakeTypes: Definition[];    // Used for creating flow handshakes
  allFlowTypes: Definition[];

}

export interface CustomerInfoTO {
  authorizationMatrix: AuthorizationMatrixTO;
  defaults: {
    localCurrency: string;
    depot: {
      id: string;
      type: string;
      address: string;
      name: string;
      openingHours: string;
    }
  };
  salesOrganisation: {
    id: string;
    phoneNumber: string;
    emailAddress: string;
  };
  blankReceiptPossible?: boolean;
  deviationManagement?: boolean;
  GS1LineRef?: boolean;
  useCcrValidation?: boolean;
  overruleMaxQty?: boolean;
  sealNumberRequired?:  boolean;
  palletExchange?: boolean;
  shipTos: {[key: string]: string};
  orderTypes?: string[];
  flowRegistrationTypes?: string[]; // Used for creating flows
  flowHandshakeTypes?: string[];        // Used for creating flow handshakes
}

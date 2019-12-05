import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ContractInfoRestService} from 'app/core/services/rest/contract-info.rest.service';
import {RootState} from 'app/core/store';
import * as actions from 'app/core/store/contract-info/contract-info.actions';
import {ContractInfo, ContractInfoLevel, ContractInfoTO} from 'app/core/store/contract-info/contract-info.interface';
import {Place} from 'app/core/store/florders/place.interface';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {FilterValuesService} from './filter-values.service';
import {ReplaySubject} from 'rxjs';

export interface ContractInfoCharacteristics {
  type: 'ORDER' | 'FLOWR' | 'FLOWH';
  orderType: string;
  shippingCondition: string;
  fromId: string;
  toId: string;
  incoterm: string;
}

@Injectable()
export class ContractInfoService {

  constructor(
    private store: Store<RootState>,
    private contractInfoRestService: ContractInfoRestService,
    private filterValuesService: FilterValuesService,
    ) {
  }

  loadContractInfoFromOrderTypeToIncoterm(type: 'FLOWH'|'FLOWR'|'ORDER', orderTypeId: string): Observable<void> {
    const subject = new Subject<void>();
    this.store.dispatch(new actions.ContractInfoLoadAction({ from: ContractInfoLevel.ORDERTYPE, to: ContractInfoLevel.INCOTERM, ids: [type, orderTypeId] }));
    this.store
      .take(1)
      .subscribe(state => {
        this.contractInfoRestService.getContractInfoOrderTypeToIncoterm(state.session.activeCustomer.id, type, orderTypeId).subscribe(
          (contractInfo: ContractInfoTO) => {
            this.makeSureLatestFilterValuesAreLoaded({ contractInfo, state, type }).subscribe((state) => {
              this.store.dispatch(new actions.ContractInfoLoadSuccessAction({ type, contractInfo, definitions: state.definitions, locations: this.getLocations(type, state) }));
              subject.next();
              subject.complete();
            });
          },
          error => {
            this.store.dispatch(new actions.ContractInfoLoadFailAction({ error }));
            subject.error(error);
          });
      });
    return subject.asObservable();
  }

  private getLocations(type: 'FLOWH'|'FLOWR'|'ORDER', state) {
    let locations: Place[];
    if (type === 'ORDER') {
      locations = state.orders.filterValues.locations;
    } else {
      locations = state.flows.filterValues.locations;
    }
    return locations;
  }

  loadContractInfoFromFromToIncoterm({ type, orderTypeId, shippingCondition, fromId }: { type: 'FLOWH'|'FLOWR'|'ORDER', orderTypeId: string, shippingCondition: string, fromId: string }) {
    const subject = new Subject<void>();
    if (fromId === 'all') {
      fromId = '';
    }
    this.store.dispatch(new actions.ContractInfoLoadAction({ from: ContractInfoLevel.FROM, to: ContractInfoLevel.INCOTERM, ids: [type, orderTypeId, shippingCondition, fromId] }));
    this.store
      .take(1)
      .subscribe(state => {
        this.contractInfoRestService.getContractInfoOrderTypeToIncoterm(state.session.activeCustomer.id, type, orderTypeId).subscribe(
          (contractInfo: ContractInfoTO) => {
            this.store.dispatch(new actions.ContractInfoLoadSuccessAction({ type, contractInfo, definitions: state.definitions, locations: this.getLocations(type, state)}));
            subject.next();
            subject.complete();
          },
          error => {
            this.store.dispatch(new actions.ContractInfoLoadFailAction({ error }));
            subject.error(error);
          });
      });
    return subject.asObservable();
  }

  loadContractInfoMaterials({ type, orderTypeId, shippingCondition, fromId, toId, incoterm }: { type: 'FLOWH'|'FLOWR'|'ORDER', orderTypeId: string, shippingCondition: string, fromId: string, toId: string, incoterm: string }): Observable<void> {
    const subject = new Subject<void>();
    if (fromId === 'all') {
      fromId = '';
    }
    if (toId === 'all') {
      toId = '';
    }
    if (incoterm === '-') {
      incoterm = '';
    }
    if (shippingCondition === '-') {
      shippingCondition = '';
    }

    if (shippingCondition === 'Z1') {
      if (orderTypeId === 'EPS-CUS' && (!fromId || fromId.trim() === '')) {
        fromId = '';
      }
      if (orderTypeId === 'CUS-EPS' && (!toId || toId.trim() === '')) {
        toId = '';
      }
    }

    this.store.dispatch(new actions.ContractInfoLoadAction({ from: ContractInfoLevel.INCOTERM, to: ContractInfoLevel.MATERIALS, ids: [type, orderTypeId, shippingCondition, fromId, toId, incoterm] }));
    this.store
      .take(1)
      .subscribe(
        state => {
          this.contractInfoRestService.getContractInfoMaterials(state.session.activeCustomer.id, type, orderTypeId, shippingCondition, fromId, toId, incoterm).subscribe(
            (contractInfo: ContractInfoTO) => {
              this.store.dispatch(new actions.ContractInfoLoadSuccessAction({ contractInfo, definitions: state.definitions, locations: this.getLocations(type, state), type }));
              subject.next();
              subject.complete();
            },
            error => {
              this.store.dispatch(new actions.ContractInfoLoadFailAction({ error }));
              subject.error(error);
            });
        });
    return subject.asObservable();
  }

  /**
   * Load contract info for an existing order or flow (2 parts)  Check if contract is valid for order / flow (from orderType to incoterm inclusive, not materials)
   *
   * @param ci: contractInfo characteristics
   * @param messageCode deprecated, to be removed
   * @param titleCode deprecated, to be removed
   * @param failCB invalid-callback. deprecated, to be removed.  users show listen to observable
   */
  loadContractInfoAndCheck(ci: ContractInfoCharacteristics) {
  // loadContractInfoAndCheck(ci: ContractInfoCharacteristics, messageCode, titleCode, failCB: ((error: any, titleCode: string)=>void)) {
    const subject = new Subject<boolean>();
    // Now start loading parts of contract & validate order against current contract
    let orderTypeLoaded = false;
    let materialsLoaded = false;
    let contractVerified = false;
    this.store
      .distinctUntilChanged((s1, s2) => s1.contractInfo === s2.contractInfo)
      .filter(state => !state.contractInfo.loading)
      .takeWhile(() => !contractVerified)
      .subscribe(state => {
        if (!orderTypeLoaded) {
          // Load orderType structure
          orderTypeLoaded = true;
          this.loadContractInfoFromOrderTypeToIncoterm(ci.type, ci.orderType);
        } else if (!materialsLoaded) {
          // Load materials
          materialsLoaded = true;
          let fromId = ci.fromId;
          let toId = ci.toId;
          if (ci.shippingCondition === 'Z1') {
            if (ci.orderType === 'EPS-CUS') {
              fromId = '';
            }
            if (ci.orderType === 'CUS-EPS') {
              toId = '';
            }
          }
          this.loadContractInfoMaterials({ fromId, toId, incoterm: ci.incoterm, shippingCondition: ci.shippingCondition, type: ci.type, orderTypeId: ci.orderType });
        } else {
          // Verify contract
          contractVerified = true;
          let contractInfoSucessfullyLoaded = !state.contractInfo.failed;
          const orderType = contractInfoSucessfullyLoaded && this.getOrderTypes(state.contractInfo, ci.type).find(ot => ot.id === ci.orderType);
          const shippingCondition = orderType && orderType.shippingConditions.find(sc => sc.id === ci.shippingCondition);
          const from = shippingCondition && shippingCondition.froms.find(f => f.id === (ci.fromId || 'all'));
          const to = from && from.tos.find(t => t.id === (ci.toId || 'all'));
          const incoterm = to && to.incoterms.find(i => i.id === (ci.incoterm || '' || '-'));
          subject.next(!!incoterm);
          subject.complete();
          // ps: didn't check materials of loaded florderDetail !!
        }
      });
    return subject.asObservable();
  }

  private getOrderTypes(contractInfo: ContractInfo, type: 'FLOWH' | 'FLOWR' | 'ORDER') {
    switch (type) {
      case 'FLOWH':
        return contractInfo.flowHandshakeTypes;
      case 'FLOWR':
        return contractInfo.flowRegistrationTypes;
      case 'ORDER':
        return contractInfo.orderTypes;

    }
  }

  private makeSureLatestFilterValuesAreLoaded({contractInfo, state, type}: { contractInfo: ContractInfoTO; state: RootState, type: 'FLOWH'|'FLOWR'|'ORDER' }): Observable<RootState> {

    // Find a from or to that is not in the locations
    const locationFromContractMissingInLocations = contractInfo.orderTypes.find(ot => {
      return !!ot.shippingConditions.find( sc => {
        return !!sc.froms.find(f => {
          const locations = this.getLocations(type, state);
          let notfound = !locations.find(place => place.id === f.id);
          if (!notfound) {
            notfound = !!f.tos.find(t => !locations.find(place => place.id === f.id))
          }
          return notfound;
        })
      })
    });

    const subject = new ReplaySubject<RootState>(); // Use a replaySubject because next() & complete() can be called before the observable is returned and subscribed to

    // If location is missing in filterValues, reload the filterValues
    if (locationFromContractMissingInLocations){
      // load order or flow filtervalues
      switch(type) {
        case 'ORDER':
          this.filterValuesService.loadOrdersFilterValues(() => {}).subscribe(()=> {
            this.store.take(1).subscribe(state => { // Get new state with the new locations included
              subject.next(state);
              subject.complete();
            })
          });
          break;
        case 'FLOWH':
        case 'FLOWR':
          this.filterValuesService.loadFlowsFilterValues(() => {}).subscribe(()=> {
            this.store.take(1).subscribe(state => { // Get new state with the new locations included
              subject.next(state);
              subject.complete();
            })
          });
          break;

      }
    } else {
      // Else just use the current state
      subject.next(state);
      subject.complete();
    }
    return subject.asObservable();
  }
}

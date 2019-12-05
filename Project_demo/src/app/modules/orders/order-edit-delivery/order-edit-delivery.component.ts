import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { Place } from 'app/core/store/florders/place.interface';
import { CDFrom, CDIncoterm, CDShippingCondition, CDTo } from '../../../core/store/contract-details/contract-details.interface';
import { ContractInfo } from '../../../core/store/contract-info/contract-info.interface';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { util } from '../../../core/util/util';
import { FlorderEditDeliveryComponent } from '../../florders/florder-edit-delivery/florder-edit-delivery.component';
import { PoNumberAsyncValidator } from '../../florders/florder-edit-delivery/po-number-async-validator';

@Component({
  selector: 'app-order-edit-delivery',
  templateUrl: './order-edit-delivery.component.html',
  styleUrls: ['../../florders/florder-edit-delivery/florder-edit-delivery.component.less'],
  animations: [
    trigger('growInOut', [
      state('in', style({ height: '50px' })),
      transition('void => *', [
        style({ height: 0 }),
        animate(400),
      ]),
      transition('* => void', [animate(400, style({ height: 0 }))]),
    ]),
  ],
})
export class OrderEditDeliveryComponent extends FlorderEditDeliveryComponent implements OnChanges {

  @Input() orderDetail: FlorderDetail;
  @Input() contractInfo: ContractInfo;
  @Input() filterValues: FilterValues;
  @Input() isEpsUser: boolean;
  @Input() defaultDepot: Place;

  @Output('resetMaterialsAndPlanning') resetMaterialsAndPlanningEventEmiiter: EventEmitter<null> = new EventEmitter();
  @Output('fromSelected') fromSelectedEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output('orderTypeSelected') orderTypeSelectedEventEmitter: EventEmitter<string> = new EventEmitter();

  askIncoterms = false;

  constructor(formBuilder: FormBuilder, translate: TranslateService, protected poNumberAsyncValidator: PoNumberAsyncValidator, cd: ChangeDetectorRef) {
    super(formBuilder, translate, poNumberAsyncValidator, cd);
  }

  createForm(): void {
    super.createForm();
    this.triggerValidatePONumber();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initOrderTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderDetail && changes.orderDetail.previousValue && changes.orderDetail.previousValue.etmOrderNumber && !changes.orderDetail.currentValue.etmOrderNumber) {
      this.ngOnInit();
    }
    if (changes.contractInfo) {
      this.initOrderTypes();
    }
  }

  initOrderTypes() {
    if (this.contractInfo.orderTypes && this.contractInfo.orderTypes.length > 0 && this.deliveryForm) {
      if (this.deliveryForm.get('type') && this.deliveryForm.get('type').value) {
        this.setShippingConditions();
      }
    } else {
      // No default selection anymore
      this.shippingConditions = [];
      this.froms = [];
      this.tos = [];
      this.incoterms = [];
    }

    // If only 1 orderType: select it and trigger load of next part of contract
    if (this.contractInfo.orderTypes.length === 1 && this.deliveryForm && !this.deliveryForm.value.type) {
      this.deliveryForm.get('type').setValue(this.contractInfo.orderTypes[0].id, { emitEvent: false });
      this.orderTypeSelectedEventEmitter.emit(this.deliveryForm.value.type);
    }

    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  orderTypeChanged() {
    this.deliveryForm.controls['shippingCondition'].setValue('');
    this.deliveryForm.controls['incoterm'].setValue('');
    this.deliveryForm.controls['customerReferenceNumber'].setValue('');
    this.deliveryForm.controls['senderReferenceNumber'].setValue('');
    this.deliveryForm.controls['transporter'].setValue('');
    this.deliveryForm.controls['licensePlate'].setValue('');
    this.resetMaterialsAndPlanningEventEmiiter.emit();

    this.orderTypeSelectedEventEmitter.emit(this.deliveryForm.value.type);

    this.setShippingConditions();
  }

  toChanged() {
    this.setValidationOnPoReferenceNumber();
    this.setIncoterms();
  }

  incotermChanged() {
    this.setValidationOnPoReferenceNumber();
    this.validatePONumber();
  }

  private setShippingConditions(): void {
    this.shippingConditions = util.setSelectElements<CDShippingCondition>({
      selectedId: this.deliveryForm.get('type').value,
      containerArray: this.contractInfo.orderTypes,
      childSelector: orderType => orderType.shippingConditions,
      childControls: this.deliveryForm.get('shippingCondition'),
      defaultAll: false,
      returnObject: true,
      cascade: this.setFroms.bind(this),
    });
    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  private setFroms(): void {
    this.froms = util.setSelectElements<CDFrom>({
      selectedId: this.deliveryForm.get('shippingCondition').value && this.deliveryForm.get('shippingCondition').value.id,
      containerArray: this.contractInfo.orderTypes.find(orderType => orderType.id === this.deliveryForm.get('type').value).shippingConditions,
      childSelector: shippingCondition => shippingCondition.froms,
      childControls: this.deliveryForm.get('from'),
      defaultAll: false,
      returnObject: true,
      cascade: this.setTos.bind(this),
      getTitle: from => util.generateAddressString(this.filterValues.locations, from.id, this.translate.instant('SHARED.LABELS.NO_ADDRESS')),
      sort: true,
    });
    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  fromSelected() {
    this.fromSelectedEventEmitter.emit(null);
    this.setTos();
  }

  setTos(): void {
    let from = this.deliveryForm.get('from').value;
    let defaultAll = false;
    if (this.deliveryForm.get('shippingCondition').value && this.deliveryForm.get('shippingCondition').value.id === 'Z1') {
      const orderType = this.contractInfo.orderTypes.find(orderType => orderType.id === this.deliveryForm.get('type').value);
      const shippingCondition = orderType.shippingConditions.find(sc => sc.id === this.deliveryForm.get('shippingCondition').value.id);
      if (orderType.id === 'EPS-CUS') {
        if (this.isEpsUser) { // Is EPS user
          if (this.defaultDepot  && (!from || from.id.trim() === '')) { // No from selected yet, and there is a default depot ?
            from = shippingCondition.froms.find(f => f.id === this.defaultDepot.id);
          }
        } else { // Is a client user: always use 'all'
          from = shippingCondition.froms.find(from => from.id === 'all');
        }
        this.deliveryForm.get('from').setValue(from);
      }
      if (orderType.id === 'CUS-EPS') {
        defaultAll = true;
        // to is empty, take 'all to'
        const fromId = from && from.id;
        from = shippingCondition.froms.find(from => from.id === fromId);

        if (from) {
          let to = this.deliveryForm.get('to').value;
          const toId = to && to.id;
          to = to && from.tos.find(to => to.id === toId);

          if (this.isEpsUser) { // If it's an EPS user and didn't select a to yet, then take default depot if exists
            if (!to && this.defaultDepot) { // No from selected yet, and there is a default depot ?
              to = from.tos.find(f => f.id === this.defaultDepot.id);
            }
          } else { // is a client user, always use 'all'
            to = from && from.tos.find(from => from.id === 'all');
          }
          this.deliveryForm.get('to').setValue(to);
          this.setIncoterms();
        }
      }
    }
    this.tos = util.setSelectElements<CDTo>({
      defaultAll,
      selectedId: from && from.id,
      containerArray: this.deliveryForm.get('shippingCondition').value &&
        this.contractInfo.orderTypes
          .find(ot => ot.id === this.deliveryForm.get('type').value).shippingConditions
          .find(sc => sc.id === this.deliveryForm.get('shippingCondition').value.id).froms || [],
      childSelector: from => from.tos,
      returnObject: true,
      childControls: [this.deliveryForm.get('to')],
      sort: true,
      cascade: this.setIncoterms.bind(this),
      getTitle: to => util.generateAddressString(this.filterValues.locations, to.id, this.translate.instant('SHARED.LABELS.NO_ADDRESS')),
    });
    this.setValidationOnPoReferenceNumber();
    this.setIncoterms();
    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  setIncoterms(): void {
    const shippingConditions = this.contractInfo.orderTypes.find(ot => ot.id === this.deliveryForm.get('type').value).shippingConditions;
    const froms = this.deliveryForm.get('shippingCondition').value && shippingConditions.find(sc => sc.id === this.deliveryForm.get('shippingCondition').value.id).froms || [];
    let from = this.deliveryForm.get('from').value;
    from = from && froms.find(f => f.id === from.id); // Replace with full blown object, check if really in contract
    const tos = from && from.tos || [];
    this.incoterms = util.setSelectElements<CDTo>({
      selectedId: this.deliveryForm.get('to').value && this.deliveryForm.get('to').value.id,
      containerArray: tos,
      childSelector: to => to.incoterms,
      returnObject: true,
      childControls: [this.deliveryForm.get('incoterm')],
      defaultAll: false,
    });
    this.askIncoterms = !!this.incoterms.find(i => i.id !== '-') || !!(this.orderDetail.deliveryMethod.incoterm && this.orderDetail.deliveryMethod.incoterm.id);
    if (!this.askIncoterms && this.deliveryForm.get('type').value === 'CUS-EPS') {
      this.deliveryForm.get('incoterm').setValue(this.incoterms.length && this.incoterms[0]);
    }
    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  protected getTo(): CDTo {
    const orderType = this.contractInfo.orderTypes.find(orderType => orderType.id === this.deliveryForm.get('type').value);
    const shippingCondition = orderType
      && this.deliveryForm.get('shippingCondition').value
      && orderType.shippingConditions.find(sc => this.deliveryForm.get('shippingCondition').value
        && sc.id === this.deliveryForm.get('shippingCondition').value.id);
    const from = shippingCondition && shippingCondition.froms.find(from => this.deliveryForm.get('from').value && from.id === this.deliveryForm.get('from').value.id);

    return from && from.tos.find(to => this.deliveryForm.get('to').value && to.id === this.deliveryForm.get('to').value.id);
  }

  protected getIncoterm(): CDIncoterm {
    const to = this.getTo();
    return to && this.deliveryForm.get('incoterm').value && to.incoterms.find(it => it.id === this.deliveryForm.get('incoterm').value.id);
  }

  protected getControlsConfig() {
    return Object.assign(super.getControlsConfig(), {
      soldTo: [this.deliveryMethod.soldTo],
      shippingCondition: [
        this.deliveryMethod.shippingCondition,
        [Validators.required],
      ],
      incoterm: [
        this.deliveryMethod.incoterm,
        [Validators.required],
      ],
    });
  }

  doNextClicked() {
    if (this.deliveryForm.valid && !this.pending) {
      this.nextClicked.emit(this.deliveryForm.value);
    }
  }

  protected getEtmOrderNumber(): string {
    return this.orderDetail && this.orderDetail.etmOrderNumber;
  }

  showFrom() {
    const epsUserFilledInFrom = this.isEpsUser && this.deliveryForm && this.deliveryForm.value.from && this.deliveryForm.value.from.id !== 'all';
    return epsUserFilledInFrom || !this.deliveryForm || !this.deliveryForm.value.shippingCondition || this.panelStatus.isView || this.deliveryForm.value.type !== 'EPS-CUS' || this.deliveryForm.value.shippingCondition.id !== 'Z1';
  }

  showTo() {
    const epsUserFilledInTo = this.isEpsUser && this.deliveryForm && this.deliveryForm.value.to && this.deliveryForm.value.to.id !== 'all';
    return epsUserFilledInTo || !this.deliveryForm || !this.deliveryForm.value.shippingCondition || this.panelStatus.isView || this.deliveryForm.value.type !== 'CUS-EPS' || this.deliveryForm.value.shippingCondition.id !== 'Z1';
  }

  canEditFromField(): boolean {
    return this.isEpsUser || this.deliveryForm.value.type !== 'EPS-CUS' || !this.deliveryForm.value.shippingCondition || this.deliveryForm.value.shippingCondition.id !== 'Z1';
  }

  canEditToField(): boolean {
    return this.isEpsUser || this.deliveryForm.value.type !== 'CUS-EPS' || !this.deliveryForm.value.shippingCondition || this.deliveryForm.value.shippingCondition.id !== 'Z1';
  }
}

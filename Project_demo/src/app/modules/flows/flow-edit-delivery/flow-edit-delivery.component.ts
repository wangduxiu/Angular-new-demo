import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { CDFrom, CDTo } from '../../../core/store/contract-details/contract-details.interface';
import { ContractInfo } from '../../../core/store/contract-info/contract-info.interface';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { util } from '../../../core/util/util';
import { FlorderEditDeliveryComponent } from '../../florders/florder-edit-delivery/florder-edit-delivery.component';
import { PoNumberAsyncValidator } from '../../florders/florder-edit-delivery/po-number-async-validator';

@Component({
  selector: 'app-flow-edit-delivery',
  templateUrl: './flow-edit-delivery.component.html',
  styleUrls: ['../../florders/florder-edit-delivery/florder-edit-delivery.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush // don't always check for changes, only when input changed (but there's no input here)

  animations: [
    trigger('growInOut', [
      state('in', style({ height: '50px' })),
      transition('void => *', [
        style({ height: 0 }),
        animate(400)
      ]),
      transition('* => void', [
        animate(400, style({ height: 0 }))
      ])
    ])
  ]
})
export class FlowEditDeliveryComponent extends FlorderEditDeliveryComponent implements OnChanges {
  wholesalers: Definition[] = [];
  wholesalerRequired: boolean = false;
  toError: String = '';
  fromError: String = '';

  @Input() flowDetail: FlorderDetail;
  @Input() filterValues: FilterValues;
  @Input() contractInfo: ContractInfo;
  @Output() resetMaterialsAndPlanning:EventEmitter<null> = new EventEmitter();
  @Output('flowTypeSelected') flowTypeSelectedEventEmitter: EventEmitter<string> = new EventEmitter();

  readonly = {
    flowType: false,
    from: false,
    to: false,
    remarks: false,
    licensePlate: false,
    transporter: false,
    wholesaler: false,
    senderReferenceNumber: false,
    customerReferenceNumber: false,
  };

  constructor(formBuilder: FormBuilder, translate: TranslateService, protected poNumberAsyncValidator: PoNumberAsyncValidator, cd: ChangeDetectorRef) {
    super(formBuilder, translate, poNumberAsyncValidator, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initFlowTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.flowDetail && changes.flowDetail.previousValue && changes.flowDetail.previousValue.etmOrderNumber && !changes.flowDetail.currentValue.etmOrderNumber) {
      this.ngOnInit();
    }
    if (changes.flowTypes) {
      this.initFlowTypes();
    }
    if (changes.panelStatus) {
      this.defineReadonly();
    }
    if (changes.deliveryMethod) {
      this.ngOnInit();
    }
    if (changes.contractInfo) {
      this.initFlowTypes();
    }
  }

  flowTypeChanged() {
    this.deliveryForm.controls['from'].setValue({});
    this.deliveryForm.controls['to'].setValue({});
    this.deliveryForm.controls['wholesaler'].setValue({});
    this.deliveryForm.controls['customerReferenceNumber'].setValue('');
    this.deliveryForm.controls['senderReferenceNumber'].setValue('');
    this.deliveryForm.controls['transporter'].setValue('');
    this.deliveryForm.controls['licensePlate'].setValue('');
    this.deliveryForm.controls['remarks'].setValue('');

    this.flowTypeSelectedEventEmitter.emit(this.deliveryForm.value.type);

    this.resetMaterialsAndPlanning.emit();
    this.setFroms();
  }

  initFlowTypes() {
    if (this.getFlowTypes().length > 0 && this.deliveryForm) {
      this.setFroms();
    } else {
      this.froms = [];
      this.tos = [];
      this.wholesalers = [];
    }

    // If only 1 orderType: select it and trigger load of next part of contract
    if (this.getFlowTypes().length === 1 && this.deliveryForm && !this.deliveryForm.value.type) {
      this.deliveryForm.get('type').setValue(this.getFlowTypes()[0].id, {emitEvent: false});
      this.flowTypeSelectedEventEmitter.emit(this.deliveryForm.value.type);
    }

    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  setFroms(): void {
    this.froms = util.setSelectElements<CDFrom>({
      selectedId: this.deliveryForm.get('type').value,
      containerArray: this.getFlowTypes(),
      childSelector: flowType => flowType.shippingConditions.length && flowType.shippingConditions[0].froms || [],
      childControls: this.deliveryForm.get('from'),
      defaultAll: false,
      returnObject: true,
      cascade: this.setTos.bind(this),
      getTitle: from => util.generateAddressString(this.filterValues.locations, from.id, this.translate.instant('SHARED.LABELS.NO_ADDRESS')),
    });
    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  fromChanged(): void {
    this.setTos();
  }

  private setTos(): void {
    let containerParent = this.getFlowTypes().find(flowtype => flowtype.id === this.deliveryForm.get('type').value);
    if (containerParent) {
      this.tos = util.setSelectElements<CDTo>({
        selectedId: this.deliveryForm.get('from').value && this.deliveryForm.get('from').value.id,
        containerArray: containerParent && containerParent.shippingConditions.length && containerParent.shippingConditions[0].froms || [],
        childSelector: from => from.tos,
        cascade: this.setClearing.bind(this),
        childControls: [this.deliveryForm.get('to')],
        returnObject: true,
        defaultAll: false,
        getTitle: to => util.generateAddressString(this.filterValues.locations, to.id, this.translate.instant('SHARED.LABELS.NO_ADDRESS')),
      });
      this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
    }
  }

  protected getTo(): CDTo {
    const flowType = this.getFlowTypes().find(flowtype => flowtype.id === this.deliveryForm.get('type').value);
    const from = flowType && flowType.shippingConditions.length && flowType.shippingConditions[0].froms.find(from => this.deliveryForm.get('from').value && from.id === this.deliveryForm.get('from').value.id);
    return from && from.tos.find(to => this.deliveryForm.get('to').value && to.id === this.deliveryForm.get('to').value.id);
  }

  toChanged(): void {
    this.validatePONumber();
    const to = this.getTo();
    this.setClearing(to);
    this.setValidationOnPoReferenceNumber();
    this.poNumberMask = to && to.poNumber && to.poNumber.example && (this.translate.instant('ORDERS.DELIVERY.LABELS.MASK') + to.poNumber.example) || '';
  }

  private setClearing(to: CDTo): void {
    to = to || this.getTo();

    const toClearing = to && to.clearing;
    const clearing = this.deliveryMethod && this.deliveryMethod.clearing ? this.deliveryMethod.clearing : toClearing;

    (this.deliveryForm.get('clearing') as FormControl).setValue(clearing);

    // set wholesalers
    this.wholesalers = to && to.wholesaler && to.wholesaler.wholesalers ||  [];
    this.wholesalerRequired = to && to.wholesaler && to.wholesaler.mandatory;

    if (this.wholesalerRequired && this.wholesalers.length === 1) {
      // set the field if only one wholesaler
      (this.deliveryForm.get('wholesaler') as FormControl).setValue(this.wholesalers[0]);
    }
  }

  createForm(): void {
    super.createForm();
    this.triggerValidatePONumber();
    const getWholeSalerRequiredDummyControl = () => {
      const to = this.getTo();
      const toControl = this.deliveryForm.get('to');
      return {
        value: to && to.wholesaler && to.wholesaler.mandatory, // Value to evaluate whether or not to add required validator to control
        valueChanges: {
          subscribe: toControl.valueChanges.subscribe.bind(toControl.valueChanges), // re-evaluate condition when TO changed
        },
      };
    };
    util.conditionalValidation(this.deliveryForm, 'wholesaler', [util.createCondition(getWholeSalerRequiredDummyControl)], [Validators.required]);
  }

  defineReadonly() {
    this.readonly = {
      flowType: this.panelStatus.isFlowEdit,
      from: this.panelStatus.isFlowEdit,
      to: this.panelStatus.isFlowEdit,
      remarks: this.panelStatus.isFlowEdit && this.flowDetail.handshaker,
      licensePlate: this.panelStatus.isFlowEdit && this.flowDetail.handshaker,
      transporter: this.panelStatus.isFlowEdit && this.flowDetail.handshaker,
      wholesaler: this.panelStatus.isFlowEdit && this.flowDetail.handshaker,
      senderReferenceNumber: false,
      customerReferenceNumber: false,
      // senderReferenceNumber: this.panelStatus.isFlowEdit && this.flowDetail.handshaker
    }
  }
  protected getControlsConfig() {
    return Object.assign(super.getControlsConfig(), {
      wholesaler: [this.deliveryMethod.wholesaler],
      remarks: [this.deliveryMethod.remarks],
      remarksHandshaker: [this.deliveryMethod.remarksHandshaker],
    });
  }

  protected getEtmOrderNumber(): string {
    return this.flowDetail && this.flowDetail.etmOrderNumber;
  }

  nextClickedFn() {
    if (!this.pending && this.deliveryForm.valid) {
      this.nextClicked.emit(this.deliveryForm.value);
    }
  }

  private getFlowTypes() {
    let flowTypes = this.flowDetail.handshaker ? this.contractInfo.flowHandshakeTypes : this.contractInfo.flowRegistrationTypes;
    return flowTypes || [];
  }

}

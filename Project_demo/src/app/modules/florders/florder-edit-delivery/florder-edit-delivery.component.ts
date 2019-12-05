import { ChangeDetectorRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { CDTo } from '../../../core/store/contract-details/contract-details.interface';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { DeliveryMethod } from '../../../core/store/florder-detail/florder-detail.interface';
import { PanelStatus } from '../florder-edit-container/florder-edit.interface';
import { PoNumberAsyncValidator, ValidationParams } from './po-number-async-validator';

export abstract class FlorderEditDeliveryComponent implements OnInit {
  private type: string;
  deliveryForm;
  shippingConditions: Definition[] = [];
  froms: Definition[] = [];
  tos: Definition[] = [];
  incoterms: Definition[] = [];
  poNumberMandatory: boolean = false;
  poValidationError: string;
  poValidationWarning: string;
  pending = false;
  poNumberMask: string = '';

  @Input() protected deliveryMethod: DeliveryMethod;
  @Input() panelStatus: PanelStatus;
  @Input() definitions: Definitions;

  @Output() nextClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  @Output() formValidChanged = new EventEmitter();

  private subscriptions: Subscription[] = [];
  private validationPerformed = false;

  constructor(private formBuilder: FormBuilder, protected translate: TranslateService, protected poNumberAsyncValidator: PoNumberAsyncValidator, protected cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.createForm();

    // If this component is not in edit mode, and validation not yet triggered
    if (!this.panelStatus.isEdit && !this.validationPerformed) {
      [
        'customerReferenceNumber',
        'senderReferenceNumber'
      ].forEach(prop => {
        this.deliveryForm.get(prop).updateValueAndValidity();
      });
      this.validationPerformed = true;
    }
  }

  createForm(): void {
    // Remember async validation errors
    let customerReferenceNumberErrors = this.deliveryForm && this.deliveryForm.get('customerReferenceNumber') && this.deliveryForm.get('customerReferenceNumber').errors;
    this.deliveryForm = this.formBuilder.group(this.getControlsConfig());
    if (customerReferenceNumberErrors) {
      this.deliveryForm.get('customerReferenceNumber').setErrors(customerReferenceNumberErrors);
    }
    this.formValidChanged.emit(this.deliveryForm.valid);
    this.deliveryForm.statusChanges.map(data => this.deliveryForm.valid).distinctUntilChanged().subscribe(valid => {
      this.formValidChanged.emit(valid);
    });
  }

  /**
   * Only for flows & orders, not for relocations, so it's not part of the this createForm function anymore
   */
  protected triggerValidatePONumber() {
    const thiz = this;
    this.subscriptions.push(this.deliveryForm.get('customerReferenceNumber').valueChanges.subscribe(() => thiz.pending = true));
    this.subscriptions.push(this.deliveryForm.get('senderReferenceNumber').valueChanges.subscribe(() => thiz.pending = true));

    this.subscriptions.push(this.deliveryForm.get('customerReferenceNumber').valueChanges.debounceTime(500).subscribe(this.validatePONumber.bind(this)));
    this.subscriptions.push(this.deliveryForm.get('senderReferenceNumber').valueChanges.debounceTime(500).subscribe(this.validatePONumber.bind(this)));
  }

  protected getControlsConfig() {
    return {
      type: [this.deliveryMethod.type, Validators.required],
      from: [this.deliveryMethod.from, Validators.required],
      to: [this.deliveryMethod.to, Validators.required],
      clearing: [this.deliveryMethod.clearing],
      senderReferenceNumber: [this.deliveryMethod.senderReferenceNumber],
      customerReferenceNumber: [this.deliveryMethod.customerReferenceNumber],
      transporter: [this.deliveryMethod.transporter],
      licensePlate: [this.deliveryMethod.licensePlate],
    };
  }

  validatePONumber() {
    this.pending = true;
    const to = this.getTo();
    const toId = to && to.id;
    const poNumberValidationInfo = to && to.poNumber || { required: false, unique: false, mask: null, example: null };
    const fromId = this.deliveryForm.get('from').value && this.deliveryForm.get('from').value.id;
    const senderRefNumber = this.deliveryForm.get('senderReferenceNumber').value;
    const poNumber = this.deliveryForm.get('customerReferenceNumber').value;
    const params = {
      ...poNumberValidationInfo,
      poNumber,
      fromId,
      toId,
      senderRefNumber,
      etmOrderNumber: this.getEtmOrderNumber()
    };

    const control: FormControl = this.deliveryForm.get('customerReferenceNumber');

    if (!params.required && !params.unique && !params.mask) {
      this.pending = false; // Nothing to check
    } else if (!params.required && (poNumber == null || poNumber.trim() === '')) {
      this.pending = false; // Nothing to check
    } else if (params.required && (poNumber == null || poNumber.trim() === '')) {
      control.setErrors({ invalid: true });
      this.poValidationWarning = null;
      this.poValidationError = this.translate.instant('ERRORS.ORDER.CREATE.RECEIVER_REF_IS_EMPTY');
      this.pending = false;
    } else {
      this.poNumberAsyncValidator.doValidation(params).take(1).subscribe(response => {
        this.pending = false;
        this.poValidationWarning = null;
        this.poValidationError = null;
        if (response.success) {
          control.setErrors(null);
        }
        if (response.message) {
          if (response.success) {
            this.poValidationWarning = response.message;
          } else {
            control.setErrors({ 'invalid': true });
            this.formValidChanged.emit(false);
            this.poValidationError = response.message;
          }
        }
      });
    }
  }

  protected setValidationOnPoReferenceNumber() {
    const to: any = this.getTo();
    const poNumberValidationInfo: ValidationParams = to && to.poNumber || { required: false, unique: false, mask: null, example: null };
    this.poNumberMandatory = poNumberValidationInfo && poNumberValidationInfo.required;
    this.poNumberMask = to && (to.poNumber && to.poNumber.example && this.translate.instant('ORDERS.DELIVERY.LABELS.MASK') + to.poNumber.example) || '';
    let customerReferenceNumberControl = this.deliveryForm.get('customerReferenceNumber');
    if (this.poNumberMandatory) {
      customerReferenceNumberControl.setValue(customerReferenceNumberControl.value);
    }
  }

  protected getETMShipmentNumbersAsString(shipmentNumbers: string[]): string {
    return shipmentNumbers && shipmentNumbers.join(', ');
  }

  protected abstract getEtmOrderNumber(): string;

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  protected abstract getTo(): CDTo;
}


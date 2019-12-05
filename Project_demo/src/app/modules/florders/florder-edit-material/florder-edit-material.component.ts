import { EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { AppSettings } from '../../../app.settings';
import { ValidatorService } from '../../../core/services/validator.service';
import { CDLogisticsVarietyPacking, CDPackingId, CDPackingStatus, CDPalletId, MaterialTypes } from '../../../core/store/contract-details/contract-details.interface';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { Material } from '../../../core/store/florder-detail/florder-detail.interface';
import { util } from '../../../core/util/util';
import { PanelStatus } from '../florder-edit-container/florder-edit.interface';
import { TranslateService } from '@ngx-translate/core';

export abstract class FlorderEditMaterialComponent implements OnInit, OnChanges {

  @Input() panelStatus: PanelStatus;
  @Input() material: Material;
  @Input() materialTypes: MaterialTypes;
  @Input() saving: boolean;
  @Input() editOnlyQuantity: boolean;
  @Input() definitions: Definitions;

  @Output() saveMaterialClicked = new EventEmitter();
  @Output() nextClicked = new EventEmitter();

  private setFormStateBasedOnMaterial: boolean = false;
  packingIds: Definition[] = [];
  palletIds: Definition[] = [];
  packingPerPalletList: Definition[] = [];
  logisticsVarietyPackings: Definition[] = [];
  packingStatusses: Definition[] = [];
  editMaterialForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private validatorService: ValidatorService,
    private simplePageScrollService: SimplePageScrollService,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.saving) {
      if (changes.saving.previousValue !== changes.saving.currentValue) {
        this.focusOnSave();
      }
    }
    if (changes.definitions) {
      this.setFormStateIfRequired();
    }

    if (changes.material) {
      this.setFormStateBasedOnMaterial = true;
      this.setFormStateIfRequired();
    }

    if ((changes.materialTypes || changes.material) && this.material && this.materialTypes) {
      if (this.materialTypes[this.material.type] === null || this.material.type === 'combination' && this.materialTypes.combination.palletIds.length === 0) {
        this.material = util.deepCopy(this.material);
        if (this.materialTypes.pallets) {
          this.material.type = 'pallet';
        } else if (this.materialTypes.packings) {
          this.material.type = 'packing';
        } else if (this.materialTypes.combination.palletIds.length) {
          this.material.type = 'combination';
        }
        if (this.editMaterialForm) {
          this.typeChanged();
        }
      }
    }
  }

  typeChanged() {
    switch (this.editMaterialForm.get('type').value.toLowerCase()) {
      case 'packing':
        this.setPackingIds();
        break;
      case 'pallet':
        this.setPalletIds();
        break;
      case 'combination':
        this.setPalletIds();
        break;
    }
  }

  palletIdChanged() {
    switch (this.editMaterialForm.get('type').value) {
      case 'combination':
        this.setPackingIds();
        break;
      case 'pallet':
        this.setPackingStatusses();
        break;
    }
  }

  packingIdChanged() {
    switch (this.editMaterialForm.get('type').value) {
      case 'packing':
      case 'combination':
        this.setPackingStatusses();
        break;
    }
  }

  packingStatusChanged() {
    switch (this.editMaterialForm.get('type').value) {
      case 'pallet':
      case 'packing':
      case 'combination':
        this.setLogisticsvarietyPackings();
        break;
    }
  }

  logisticsVarietyPackingChanged() {
    switch (this.editMaterialForm.get('type').value) {
      case 'combination':
        this.setPackingPerPalletList();
        break;
    }
  }

  private setFormStateIfRequired() {
    if (this.setFormStateBasedOnMaterial || (!this.editMaterialForm && this.material)) {
      this.setFormStateBasedOnMaterial = false;
      this.editMaterialForm && this.createForm();
    }
  }

  //Override below methods from parent because no checks on contract
  protected setPalletIds() {
    let children = [];
    switch (this.editMaterialForm.get('type').value) {
      case 'pallet':
        // convert NO_LC key to more meaningfull name
        children = this.materialTypes && (this.materialTypes.pallets || []).map(pallet => {
          pallet.id === 'NO_LC' && (pallet.name = this.translateService.instant('ORDERS.MATERIAL.LABELS.NO_LC'));
          return pallet;
        });
        break;
      case 'combination':
        children = this.materialTypes && (this.materialTypes.combination.palletIds || []).map(pallet => {
          pallet.id === 'NO_LC' && (pallet.name = this.translateService.instant('ORDERS.MATERIAL.LABELS.NO_LC'));
          return pallet;
        });
        break;
    }

    util.setSelectElements<Definition>({
      children, childControls: this.editMaterialForm.get('palletId'), cascade: this.setPackingIds.bind(this),
      setter: elemnts => this.palletIds = elemnts,
    });
  }

  protected setPackingIds() {
    let children = [];
    switch (this.editMaterialForm.get('type').value) {
      case 'packing':
        children = this.materialTypes && this.materialTypes.packings || [];
        break;
      case 'combination':
        const palletId = this.materialTypes && this.materialTypes.combination.palletIds.find(palletId => palletId.id === this.editMaterialForm.get('palletId').value);
        children = palletId && palletId.packingIds || [];
        break;
    }
    this.packingIds = util.setSelectElements<Definition>({
      children, childControls: this.editMaterialForm.get('packingId'), cascade: this.setPackingStatusses.bind(this)
    });
  }

  protected setPackingStatusses() {
    if (this.editMaterialForm.get('type').value === 'combination') {
      const palletId: CDPalletId = this.materialTypes && this.materialTypes.combination.palletIds.find(palletId => palletId.id === this.editMaterialForm.get('palletId').value);
      const packingId: CDPackingId = palletId && palletId.packingIds.find(packingId => packingId.id === this.editMaterialForm.get('packingId').value);
      const children = packingId && packingId.packingStatusses || [];
      this.packingStatusses = util.setSelectElements<Definition>({
        children, childControls: this.editMaterialForm.get('packingStatus'), cascade: this.setLogisticsvarietyPackings.bind(this)
      });
    }

    if (this.editMaterialForm.get('type').value === 'packing') {
      const packingId: CDPackingId = this.materialTypes && this.materialTypes.packings.find(packingId => packingId.id === this.editMaterialForm.get('packingId').value);
      const children = packingId && packingId.packingStatusses || [];
      this.packingStatusses = util.setSelectElements<Definition>({
        children, childControls: this.editMaterialForm.get('packingStatus'), cascade: this.setLogisticsvarietyPackings.bind(this)
      });
    }

    if (this.editMaterialForm.get('type').value === 'pallet') {
      const palletId: CDPackingId = this.materialTypes && this.materialTypes.pallets.find(palletId => palletId.id === this.editMaterialForm.get('palletId').value);
      const children = palletId && palletId.packingStatusses || [];
      this.packingStatusses = util.setSelectElements<Definition>({
        children, childControls: this.editMaterialForm.get('packingStatus'), cascade: this.setLogisticsvarietyPackings.bind(this)
      });
    }
  }

  protected setLogisticsvarietyPackings() {
    if (this.editMaterialForm.get('type').value === 'combination') {
      const palletId: CDPalletId = this.materialTypes && this.materialTypes.combination.palletIds.find(palletId => palletId.id === this.editMaterialForm.get('palletId').value);
      const packingId: CDPackingId = palletId && palletId.packingIds.find(packingId => packingId.id === this.editMaterialForm.get('packingId').value);
      const packingStatus: CDPackingStatus = packingId && packingId.packingStatusses && packingId.packingStatusses.find(packingStatus => packingStatus.id === this.editMaterialForm.get('packingStatus').value);
      const children = packingStatus && packingStatus.logisticsVarietyPackings || [];
      this.logisticsVarietyPackings = util.setSelectElements<Definition>({
        children, childControls: this.editMaterialForm.get('logisticsVarietyPacking'), cascade: this.setPackingPerPalletList.bind(this)
      });
    }

    if (this.editMaterialForm.get('type').value === 'packing') {
      const packingId: CDPackingId = this.materialTypes && this.materialTypes.packings.find(packingId => packingId.id === this.editMaterialForm.get('packingId').value);
      const packingStatus: CDPackingStatus = packingId && packingId.packingStatusses && packingId.packingStatusses.find(packingStatus => packingStatus.id === this.editMaterialForm.get('packingStatus').value);
      const children = packingStatus && packingStatus.logisticsVarietyPackings || [];
      this.logisticsVarietyPackings = util.setSelectElements<Definition>({
        children, childControls: this.editMaterialForm.get('logisticsVarietyPacking'), cascade: this.setPackingPerPalletList.bind(this)
      });
    }

    if (this.editMaterialForm.get('type').value === 'pallet') {
      const palletId: CDPackingId = this.materialTypes && this.materialTypes.pallets.find(palletId => palletId.id === this.editMaterialForm.get('palletId').value);
      const packingStatus: CDPackingStatus = palletId && palletId.packingStatusses && palletId.packingStatusses.find(packingStatus => packingStatus.id === this.editMaterialForm.get('packingStatus').value);
      const children = packingStatus && packingStatus.logisticsVarietyPackings || [];
      this.logisticsVarietyPackings = util.setSelectElements<Definition>({
        children, childControls: this.editMaterialForm.get('logisticsVarietyPacking'), cascade: this.setPackingPerPalletList.bind(this)
      });
    }
  }

  protected setPackingPerPalletList() {
    if (this.editMaterialForm.get('type').value === 'combination') {
      const palletId: CDPalletId = this.materialTypes && this.materialTypes.combination.palletIds.find(palletId => palletId.id === this.editMaterialForm.get('palletId').value);
      const packingId: CDPackingId = palletId && palletId.packingIds.find(packingId => packingId.id === this.editMaterialForm.get('packingId').value);
      const packingStatus: CDPackingStatus = packingId && packingId.packingStatusses && packingId.packingStatusses.find(packingStatus => packingStatus.id === this.editMaterialForm.get('packingStatus').value);
      const logisticsVarietyPacking: CDLogisticsVarietyPacking = packingStatus && packingStatus.logisticsVarietyPackings.find(lvp => lvp.id === this.editMaterialForm.get('logisticsVarietyPacking').value);
      const children = logisticsVarietyPacking && logisticsVarietyPacking.packingsPerPallets || [];
      let packingsPerPalletControl = this.editMaterialForm.get('packingsPerPallet');
      let packingsPerPallet = packingsPerPalletControl.value;

      // Issue of packingsPerPallet-ID missing a leading 0 (should be fixed in SAP, but it's not)
      let found = children.find(c => c.id === packingsPerPallet);
      if (!found) {
        packingsPerPalletControl.setValue('0' + packingsPerPallet); // Add a '0' before
        found = children.find(c => c.id === packingsPerPallet);
      }

      this.packingPerPalletList = util.setSelectElements<Definition>({
        children, childControls: packingsPerPalletControl
      });
    }
  }

  createForm() {
    const startingType = this.material && this.material.type ? this.material.type : this.materialTypes.combination.palletIds.length && 'combination' || this.materialTypes.packings.length && 'packing' || 'pallet';
    this.editMaterialForm = this.formBuilder.group({
      internalId: [this.material.internalId],
      type: [startingType, Validators.required],
      palletId: [this.material.palletId],
      isNew: [this.material.isNew],
      packingId: [this.material.packingId],
      packingStatus: [this.material.packingStatus],
      logisticsVarietyPacking: [this.material.logisticsVarietyPacking],
      packingsPerPallet: [this.material.packingsPerPallet && this.material.packingsPerPallet.toString()],
      numberOfPallets: [this.material.numberOfPallets],
      packingQuantity: [this.material.packingQuantity],
      poNumberItemLevel: [this.material.poNumberItemLevel],
      poItemNumber: [this.material.poItemNumber],
      contentId: [this.material.contentId],
      lineReferenceId: [this.material.lineReferenceId],
    });

    this.typeChanged();

    util.conditionalValidation(this.editMaterialForm, 'palletId', [util.createCondition('type', [AppSettings.MATERIAL_TYPE_PALLET, AppSettings.MATERIAL_TYPE_COMBINATION])], [Validators.required]);
    util.conditionalValidation(this.editMaterialForm, 'packingId', [util.createCondition('type', [AppSettings.MATERIAL_TYPE_PACKING, AppSettings.MATERIAL_TYPE_COMBINATION])], [Validators.required]);
    util.conditionalValidation(this.editMaterialForm, 'packingStatus', [util.createCondition('type', [AppSettings.MATERIAL_TYPE_COMBINATION])], [Validators.required]);
    util.conditionalValidation(this.editMaterialForm, 'logisticsVarietyPacking', [util.createCondition('type', [AppSettings.MATERIAL_TYPE_COMBINATION])], [Validators.required]);
    util.conditionalValidation(this.editMaterialForm, 'packingsPerPallet', [util.createCondition('type', AppSettings.MATERIAL_TYPE_COMBINATION)], [Validators.required]);
    util.conditionalValidation(this.editMaterialForm, 'numberOfPallets', [util.createCondition('type', [AppSettings.MATERIAL_TYPE_PALLET, AppSettings.MATERIAL_TYPE_COMBINATION])], [Validators.required]);
    util.conditionalValidation(this.editMaterialForm, 'packingQuantity', [util.createCondition('type', AppSettings.MATERIAL_TYPE_PACKING)], [Validators.required]);
  }

  isPacking(): boolean {
    return this.editMaterialForm.controls.type.value === AppSettings.MATERIAL_TYPE_PACKING;
  }

  isPallet(): boolean {
    return this.editMaterialForm.controls.type.value === AppSettings.MATERIAL_TYPE_PALLET;
  }

  isCombination(): boolean {
    return this.editMaterialForm.controls.type.value === AppSettings.MATERIAL_TYPE_COMBINATION;
  }

  focusOnSave(): void {
    if (!this.saving) {
      this.simplePageScrollService.scrollToElement('#materials', 0);
    }
  }

  nextClickedFn() {
    if (!this.editMaterialForm.invalid) {
      this.saveMaterialClicked.emit(this.editMaterialForm.value);
    } else {
      if (this.formIsEmpty()) {
        this.nextClicked.emit();
      }
    }
  }

  private formIsEmpty() {
    const valueIsEmpty = (val) => {
      if (val === null || val === undefined) {
        return true;
      }
      if (typeof val === 'string' && val.trim() === '') {
        return true;
      }
      return false;
    };

    const form = this.editMaterialForm.value;
    const values = [form.lineReferenceId, form.palletId, form.packingStatus, form.logisticsVarietyPacking, form.packingsPerPallet, form.numberOfPallets, form.packingId, form.packingQuantity, form.contentId];
    return form.isNew && values.find(v => !valueIsEmpty(v)) === undefined;
  }

}

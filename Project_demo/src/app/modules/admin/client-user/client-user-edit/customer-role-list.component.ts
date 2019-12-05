import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import * as _ from 'typedash';
import { AdminDefinition } from '../../../../core/store/admin/admin-definitions/admin-definitions.interface';
import { CustomerRoleEdit } from '../../../../core/store/admin/users/users.interface';
import { util } from '../../../../core/util/util';

@Component({
  selector: 'app-customer-role-list',
  templateUrl: './customer-role-list.component.html',
  styleUrls: ['./customer-role-list.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerRoleListComponent),
      multi: true
    }
  ]
})
export class CustomerRoleListComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('shipTo') select: ElementRef;

  selectedSoldTosAndShipTos: CustomerRoleEdit[];
  availableSoldTos: AdminDefinition[] = [];
  @Input() readonly salesOrganisations: AdminDefinition[] = [];
  @Input() soldTos: AdminDefinition[] = [];
  @Input() shipTos: AdminDefinition[] = [];
  @Input() readonly roles: AdminDefinition[] = [];
  @Input() readonly loading: boolean;
  @Input() readonly maxRoles: number;
  @Input() readonly readonly: boolean;
  @Output() isEditing = new EventEmitter<boolean>();
  @Output() salesOrganisationIdSelected = new EventEmitter<string>();
  @Output() soldToIdSelected = new EventEmitter<string>();

  loadingSoldTos: boolean = false;
  loadingShipTos: boolean = false;

  propagateChange = (_: any) => { };
  propagateTouched = () => { };

  focused = false;
  showNewLine = false;
  canEditLine = true;

  newCustomerForm;
  editCustomerForm;

  constructor(private formBuilder: FormBuilder) { }

  private getControlsConfig() {
    return {
      roleId: [
        '',
        [Validators.required]
      ],
      salesOrganisationId: [
        '',
        [Validators.required]
      ],
      soldToId: [
        '',
        [Validators.required]
      ],
      shipToIds: [
        [],
        [Validators.required]
      ]
    };
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.roles && this.roles.length > 0) {
      this.addRoleNamesAndDeduplicate();
      this.setAvailableSoldTos();
    }

    if (changes.soldTos) {
      this.setAvailableSoldTos();
    }

    if (changes.shipTos) {
      if (this.newCustomerForm) {
        if (this.shipTos.length === 1) {
          this.newCustomerForm.get('shipToIds').setValue([this.shipTos[0].id]);
        } else {
          this.newCustomerForm.get('shipToIds').setValue([]);
        }
      }
      if (this.editCustomerForm) {
        const customerInEdit = this.selectedSoldTosAndShipTos.find(c => c.isEdit);
        if (customerInEdit.shipTos == null || customerInEdit.shipTos.length === 0) {
          this.editCustomerForm.get('shipToIds').setValue(this.shipTos.map(st => st.id));
        } else if (this.shipTos.length === 1) {
          this.editCustomerForm.get('shipToIds').setValue([this.shipTos[0].id]);
        } else {
          const shipToIds = this.shipTos.map(st => st.id);
          const selectedShipToIds = customerInEdit.shipTos.map(st => st.id);
          this.editCustomerForm.get('shipToIds').setValue(selectedShipToIds.filter(st => shipToIds.indexOf(st) >= 0));
        }
      }
    }

    if (changes.loading && !changes.loading.currentValue) {
      this.loadingShipTos = false;
      this.loadingSoldTos = false;
    }
  }

  writeValue(value: CustomerRoleEdit[]): void {
    // receive formControl value
    this.selectedSoldTosAndShipTos =
      value && value.map(v => {
        return {
          ...util.deepCopy(v),
          shipToNames: (v.shipTos && v.shipTos.map(shipTo => shipTo.name).join(' | ')) || null
        };
      });
    this.ngOnChanges({});
  }

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn): void {
    this.propagateTouched = fn;
  }

  startAddCustomer() {
    this.newCustomerForm = this.formBuilder.group(this.getControlsConfig());
    this.showNewLine = true;
    this.isEditing.emit(true);
  }

  getSoldTos() {
    this.availableSoldTos = [];
    this.shipTos = [];
    this.salesOrganisationIdSelected.emit(this.newCustomerForm.get('salesOrganisationId').value);
    this.loadingSoldTos = true;
  }

  getShipTosForNewForm() {
    this.soldToIdSelected.emit(this.newCustomerForm.get('soldToId').value);
    this.loadingShipTos = true;
    return true;
  }

  getShipTosForEditForm(customer) {
    this.soldToIdSelected.emit(customer.soldTo.id);
    this.loadingShipTos = true;
    return true;
  }

  /**
   * Called when a new customer / role needs to be added
   */
  addCustomer() {
    if (this.newCustomerForm && this.newCustomerForm.valid) {
      const soldToId = this.newCustomerForm.value.soldToId;
      let shipToIds = this.newCustomerForm.value.shipToIds;
      const roleId = this.newCustomerForm.value.roleId;
      this.newCustomerForm = null;
      this.editCustomerForm = null;
      if (typeof shipToIds === 'string') {
        shipToIds = [shipToIds];
      }
      this.addOrSaveCustomer(soldToId, roleId, shipToIds);
    }
  }

  /**
   * Called when changes to existing customer / role needs to be saved
   */
  saveCustomer() {
    if (this.editCustomerForm && this.editCustomerForm.valid) {
      const soldToId = this.editCustomerForm.value.soldToId;
      let shipToIds = this.editCustomerForm.value.shipToIds;
      const roleId = this.editCustomerForm.value.roleId;
      this.editCustomerForm = null;
      if (typeof shipToIds === 'string') {
        shipToIds = [shipToIds];
      }
      this.addOrSaveCustomer(soldToId, roleId, shipToIds);
    }
  }

  private addOrSaveCustomer(soldToId, roleId, shipToIds) {
    const soldTo = this.soldTos.find(c => c.id === soldToId);
    const role = this.roles.find(r => r.id === roleId);
    const existingSoldTo = this.selectedSoldTosAndShipTos.find(
      c => (c.soldTo && c.soldTo.id) === soldToId
    );
    let shipTos = shipToIds.map(id => this.shipTos.find(shipTo => shipTo.id === id)
    );
    if (shipTos.length === this.shipTos.length) {
      shipTos = null; // If all selected: select none
    }
    const shipToNames = (shipTos && shipTos.map(shipTo => shipTo.name).join(' | ')) || null;

    if (existingSoldTo) {
      Object.assign(existingSoldTo, {
        role,
        shipTos,
        shipToNames,
        isEdit: false
      });
    } else {
      this.selectedSoldTosAndShipTos.push({
        soldTo,
        shipTos,
        shipToNames,
        role,
        isEdit: false
      });
    }
    this.addRoleNamesAndDeduplicate();
    this.setAvailableSoldTos();

    this.canEditLine = true;

    //clear form
    this.cancelAddCustomer();
    this.propagateChange(this.selectedSoldTosAndShipTos);
    this.isEditing.emit(false);
  }

  removeCustomer(customer) {
    this.selectedSoldTosAndShipTos = this.selectedSoldTosAndShipTos.filter(c => (c.soldTo && c.soldTo.id) !== customer.soldTo.id);
    this.setAvailableSoldTos();
    this.canEditLine = true;
    this.propagateChange(this.selectedSoldTosAndShipTos);
  }

  cancelAddCustomer() {
    //clear form
    this.newCustomerForm = this.formBuilder.group(this.getControlsConfig());
    this.showNewLine = false;
    this.isEditing.emit(false);
  }

  editCustomer(customer) {
    customer.isEdit = true;
    this.getShipTosForEditForm(customer);
    this.editCustomerForm = this.formBuilder.group({
      soldToId: [
        customer.soldTo.id,
        [Validators.required]
      ],
      roleId: [
        customer.role.id,
        [Validators.required]
      ],
      shipToIds: [
        (customer.shipTos && customer.shipTos.map(shipTo => shipTo.id)) || this.shipTos.map(st => st.id),
        [Validators.required]
      ]
    });
    this.canEditLine = false;
    this.propagateChange(this.selectedSoldTosAndShipTos);
    this.isEditing.emit(true);
  }

  cancelEditCustomer(customer) {
    customer.isEdit = false;
    this.canEditLine = true;
    this.isEditing.emit(false);
  }

  onBlur(): void {
    this.focused = false;
    this.propagateTouched();
  }

  private addRoleNamesAndDeduplicate() {
    if (this.selectedSoldTosAndShipTos) {
      // add role-name
      this.selectedSoldTosAndShipTos.forEach(customerRole => {
        if (this.roles && this.roles.length > 0) {
          const role = !customerRole.role.name && this.roles.find(r => r.id === customerRole.role.id);
          if (role) {
            customerRole.role.name = role && role.name;
          }
        }
      });
      // Deduplicate
      this.selectedSoldTosAndShipTos = _
        .uniq(this.selectedSoldTosAndShipTos.map(c => c.soldTo && c.soldTo.id))
        .map(id => this.selectedSoldTosAndShipTos.find(c => (c.soldTo && c.soldTo.id) === id));
    }
  }

  /**
   * Set sold-tos, filter out soldTos that are already in the list
   */
  private setAvailableSoldTos() {
    // Get IDs of already selected soldTos
    const selectedSoldToIds =
      (this.selectedSoldTosAndShipTos &&
        this.selectedSoldTosAndShipTos.map(c => c.soldTo && c.soldTo.id)) ||
      [];
    // Remove already selected soldTos, and sort them
    this.availableSoldTos = this.soldTos
      .filter(c => selectedSoldToIds.indexOf(c.id) === -1)
      .sort((a: AdminDefinition, b: AdminDefinition) => {
        return a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()
          ? 1
          : a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()
            ? -1
            : a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      });
    this.availableSoldTos = this.availableSoldTos.map((st) => {
      return {
        ...st,
        name: `${st.name}`,
      };
    });
  }

  salesOrganisationSelected() {
    this.getSoldTos();
  }

  soldToSelected() {
    this.getShipTosForNewForm();
  }
}

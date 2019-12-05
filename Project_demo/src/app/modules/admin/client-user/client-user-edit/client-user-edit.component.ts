import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationMatrix } from 'app/core/store/contract-details/contract-details.interface';
import { easeInOutTrigger } from 'app/animations';
import { AdminDefinition, AdminDefinitions } from '../../../../core/store/admin/admin-definitions/admin-definitions.interface';
import { ClientUser } from '../../../../core/store/admin/users/users.interface';

@Component({
  selector: 'admin-client-user-edit',
  templateUrl: './client-user-edit.component.html',
  styleUrls: [
    '../../abstract-user/user-edit/user-edit.less',
    '../../abstract-user/user-edit-buttons/user-edit-buttons.component.less',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
  animations: [easeInOutTrigger('easeInOut', 0)],
})
export class ClientUserEditComponent {

  @Input() user: ClientUser;
  @Input() isInvitation: boolean;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() isCreate: boolean;
  @Input() adminDefinitions: AdminDefinitions;
  @Input() saving: boolean;
  @Input() reInviting: boolean;
  @Input() resettingPassword: boolean;
  @Input() loading: boolean;
  @Input() soldTosOfSalesOrganisation: AdminDefinition[];
  @Input() shipTosOfSoldTo: AdminDefinition[];
  @Input() authorization: AuthorizationMatrix;

  @Output() updateUser: EventEmitter<ClientUser> = new EventEmitter();
  @Output() inviteUser: EventEmitter<ClientUser> = new EventEmitter();
  @Output() createUser: EventEmitter<ClientUser> = new EventEmitter();
  @Output() cancelClicked: EventEmitter<ClientUser> = new EventEmitter();
  @Output() salesOrganisationIdSelected = new EventEmitter<string>();
  @Output() soldToIdSelected = new EventEmitter<string>();
  @Output() reInvite: EventEmitter<string> = new EventEmitter();
  @Output() resetPassword: EventEmitter<string> = new EventEmitter();

  userForm: FormGroup;

  isEditing: boolean = false;

  cbFeedback: boolean = false;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  private getControlsConfig() {
    return {
      firstName: [this.user.firstName, !this.isEdit ? [Validators.required] : []],
      lastName: [this.user.lastName, !this.isEdit ? [Validators.required] : []],
      email: [this.user.email, !this.isEdit ? [Validators.required] : []],
      alternateEmail: [this.user.alternateEmail, !this.isEdit ? [] : []],
      language: [this.user.language, [Validators.required]],
      isActive: [this.user.isActive, [Validators.required]],
      useEmailActors: [this.user.useEmailActors, [Validators.required]],
      isTransporter: [this.user.isTransporter, [Validators.required]],
      customers: [this.user.customers],
      isDelayed: [this.user.isDelayed],
    }
  }

  ngOnInit(): void {
    if (!this.user) {
      this.user = {
        id: '',
        isAssigned: false,
        userType: 'epsUser',
        firstName: '',
        lastName: '',
        email: '',
        alternateEmail: '',
        language: '',
        isActive: false,
        isDelayed: false,
        useEmailActors: false,
        isTransporter: false,
        customers: [],
      };
      this.isEdit = false;
      this.isView = false;
      this.isInvitation = false;
      this.isCreate = true;
    }
    this.userForm = this.formBuilder.group(this.getControlsConfig());
  }

  _updateUser(valid) {
    if (valid && !this.buttonIsDisabled()) {
      const clientUser = this.getClientUser(false);
      this.updateUser.emit(clientUser);
    }
  }

  _inviteUser(valid) {
    if (valid && !this.buttonIsDisabled()) {
      const clientUser = this.getClientUser(true);
      this.inviteUser.emit(clientUser);
    }
  }

  _createUser(valid) {
    if (valid && !this.buttonIsDisabled()) {
      const clientUser = this.getClientUser(true);
      this.createUser.emit(clientUser);
    }
  }

  private getClientUser(includeEmail: boolean) {
    return Object.assign({}, this.user, {
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      language: this.userForm.get('language').value,
      customers: this.userForm.get('customers').value,
      isActive: this.userForm.get('isActive').value,
      useEmailActors: this.userForm.get('useEmailActors').value,
      isTransporter: this.userForm.get('isTransporter').value,
      isDelayed: this.userForm.get('isDelayed').value,
      alternateEmail: this.userForm.get('alternateEmail').value,
    }, includeEmail ? {
      email: this.userForm.get('email').value,
    } : {});
  }

  buttonIsDisabled() {
    return this.isEditing || this.saving || this.reInviting || this.resettingPassword;
  }

  copyToClipboard() {
    this.cbFeedback = true;
    setTimeout(
    () => {
      this.cbFeedback = false;
      this.cd.markForCheck();
    },
    1000);
  }
}

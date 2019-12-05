import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {easeInOutTrigger} from 'app/animations';
import {AdminDefinitions} from 'app/core/store/admin/admin-definitions/admin-definitions.interface';
import {EpsUser} from 'app/core/store/admin/users/users.interface';
import {AuthorizationMatrix} from 'app/core/store/contract-details/contract-details.interface';

@Component({
  selector: 'admin-eps-user-edit',
  templateUrl: './eps-user-edit.component.html',
  styleUrls: [
    '../../abstract-user/user-edit/user-edit.less',
    '../../abstract-user/user-edit-buttons/user-edit-buttons.component.less',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
  animations: [easeInOutTrigger('easeInOut', 0)],
})
export class EpsUserEditComponent implements OnInit, OnChanges {

  salesOrganisations;
  @Input() user: EpsUser;
  @Input() adminDefinitions: AdminDefinitions;
  @Input() saving: boolean;
  @Input() reInviting: boolean;
  @Input() resettingPassword: boolean;
  @Input() isInvitation: boolean;
  @Input() isView: boolean;
  @Input() isEdit: boolean;
  @Input() isCreate: boolean;
  @Input() authorization: AuthorizationMatrix;

  @Output() inviteUser: EventEmitter<EpsUser> = new EventEmitter();
  @Output() createUser: EventEmitter<EpsUser> = new EventEmitter();
  @Output() updateUser: EventEmitter<EpsUser> = new EventEmitter();
  @Output() cancelClicked: EventEmitter<EpsUser> = new EventEmitter();
  @Output() reInvite: EventEmitter<string> = new EventEmitter();
  @Output() resetPassword: EventEmitter<string> = new EventEmitter();

  userForm: FormGroup;
  cbFeedback: boolean = false;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  private createForm() {
    this.userForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, !this.isEdit ? [Validators.required] : []],
      language: [this.user.language, [Validators.required]],
      salesOrganisations: [this.user.salesOrganisations],
      isAdmin: [this.user.isAdmin],
      isActive: [this.user.isActive],
      canRelocate: [this.user.canRelocate],
      isDelayed: [this.user.isDelayed],
      updateEpsUser: [this.user.updateEpsUser],
      inviteEpsUser: [this.user.inviteEpsUser],
      createClientUser: [this.user.createClientUser],
      updateClientUser: [this.user.updateClientUser],
      inviteClientUser: [this.user.inviteClientUser],
      resetPassword: [this.user.resetPassword],
      reInvite: [this.user.reInvite],
    });
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
        language: '',
        salesOrganisations: [],
        isAdmin: false,
        isActive: false,
        canRelocate: false,
        isDelayed: false,
        updateClientUser: false,
        inviteEpsUser: false,
        inviteClientUser: false,
        createClientUser: false,
        resetPassword: false,
        updateEpsUser: false,
        reInvite: false,
        isAgent: false,
      };
      this.isEdit = false;
      this.isView = false;
      this.isInvitation = true;
    }
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user && changes.user.currentValue) {
      this.createForm();
    }

    if (changes.adminDefinitions && changes.adminDefinitions.currentValue) {
      this.salesOrganisations = this.adminDefinitions.salesOrganisation
        .map((salesOrg) => {
          return {
          ...salesOrg,
          name: `[${salesOrg.id}] ${salesOrg.name}`,
        };
        })
        .sort((s1, s2) => s1.id < s2.id ? -1 : s1.id > s2.id ? 1 : 0);

    }
  }

  _updateUser() {
    if (this.userForm.valid && !this.buttonIsDisabled()) {
      const epsUser = this.getEpsUser(false);
      this.updateUser.emit(epsUser);
    }
  }

  _inviteUser() {
    if (this.userForm.valid && !this.buttonIsDisabled()) {
      const epsUser = this.getEpsUser(true);
      this.inviteUser.emit(epsUser);
    }
  }

  _createUser() {
    if (this.userForm.valid && !this.buttonIsDisabled()) {
      const epsUser = this.getEpsUser(true);
      this.createUser.emit(epsUser);
    }
  }

  private getEpsUser(includeEmail: boolean) {
    let isAdmin = this.userForm.get('isAdmin').value;
    return Object.assign({}, this.user, {
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      salesOrganisations: this.userForm.get('salesOrganisations').value,
      language: this.userForm.get('language').value,
      isAdmin,
      isActive: this.userForm.get('isActive').value,
      canRelocate: this.userForm.get('canRelocate').value,
      updateEpsUser: isAdmin && this.userForm.get('updateEpsUser').value,
      inviteEpsUser: isAdmin && this.userForm.get('inviteEpsUser').value,
      createClientUser: isAdmin && this.userForm.get('createClientUser').value,
      updateClientUser: isAdmin && this.userForm.get('updateClientUser').value,
      inviteClientUser: isAdmin && this.userForm.get('inviteClientUser').value,
      resetPassword: isAdmin && this.userForm.get('resetPassword').value,
      reInvite: isAdmin && this.userForm.get('reInvite').value,
      isDelayed: this.userForm.get('isDelayed').value,
    }, includeEmail ? {
      email: this.userForm.get('email').value,
    } : {});
  }

  buttonIsDisabled() {
    return this.saving || this.reInviting || this.resettingPassword;
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

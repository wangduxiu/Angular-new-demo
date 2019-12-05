import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ValidatorService } from '../../../../core/services/validator.service';
import * as _ from 'typedash';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailActorsItem } from '../../../../core/store/email-actors/email-actors.interface';

@Component({
  selector: 'app-email-actors-list',
  templateUrl: './email-actors-list.component.html',
  styleUrls: ['./email-actors-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class EmailActorsListComponent implements OnInit {

  newEmailActorForm;
  editEmailActorForm;

  showNewLine: boolean = true;
  canEditLine: boolean = true;
  emailActorInEditMode: number;

  @Input() items: any;

  @Input() isLoading: boolean;

  @Input() isSaving: boolean;

  @Output() createOrUpdateEmailActor = new EventEmitter();

  @Output() deleteEmailActor = new EventEmitter();

  @Output() deactivateEmailActor = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private translate: TranslateService) {
  }

  private getControlsConfig() {
    return {
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    }
  }

  ngOnInit(): void {
    this.newEmailActorForm = this.formBuilder.group(this.getControlsConfig());
  }

  saveEmailActor(emailActorForm, isNew: boolean) {
    if (isNew) {
      this.newEmailActorForm = this.formBuilder.group(this.getControlsConfig());
    } else {
      this.editEmailActorForm = this.formBuilder.group(this.getControlsConfigForEditForm());
    }

    this.createOrUpdateEmailActor.emit(emailActorForm);
    this.cancelEditEmailActor();
  }

  editEmailActor(emailActor: EmailActorsItem) {
    this.editEmailActorForm = this.formBuilder.group(this.getControlsConfigForEditForm(emailActor));
    this.emailActorInEditMode = emailActor.id;
    this.canEditLine = false;
    this.showNewLine = false;
  }

  cancelEditEmailActor() {
    this.emailActorInEditMode = null;
    this.canEditLine = true;
    this.showNewLine = true;
  }

  private getControlsConfigForEditForm(emailActor?: EmailActorsItem) {
    return {
      id: [emailActor && emailActor.id || null, [Validators.required]],
      name: [emailActor && emailActor.name || null, [Validators.required]],
      email: [emailActor && emailActor.email || null, [Validators.required]],
      isActive: [emailActor && emailActor.isActive || null, [Validators.required]]
    }
  }
}

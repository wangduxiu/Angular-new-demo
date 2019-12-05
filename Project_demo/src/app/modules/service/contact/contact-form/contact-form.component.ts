import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslationHelperService } from '../../../../core/services/translate-helper.service';
import { Definition } from '../../../../core/store/definitions/definition.interface';
import { util } from '../../../../core/util/util';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class ContactFormComponent implements OnInit {

  private SUBJECT_REQUEST_EXTRA_USERS = 'REQUEST_EXTRA_USERS';
  private SUBJECT_ADDRESS_CHANGE = 'ADDRESS_CHANGE';
  private SUBJECT_ADD_SOLDTO = 'ADD_SOLDTO';
  private SUBJECT_ADD_SHIPTO = 'ADD_SHIPTO';
  private SUBJECT_REPORT_STOCK_PROBLEMS = 'REPORT_STOCK_PROBLEMS';
  private SUBJECT_CHANGE_CUSTOMER_REF = 'CHANGE_CUSTOMER_REF';
  private SUBJECT_CHANGE_ORDER = 'CHANGE_ORDER';
  private SUBJECT_CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
  private subjectKeys = [this.SUBJECT_REQUEST_EXTRA_USERS, this.SUBJECT_ADDRESS_CHANGE, this.SUBJECT_ADD_SOLDTO, this.SUBJECT_ADD_SHIPTO, this.SUBJECT_REPORT_STOCK_PROBLEMS, this.SUBJECT_CHANGE_CUSTOMER_REF, this.SUBJECT_CHANGE_ORDER, this.SUBJECT_CHANGE_LANGUAGE];

  contactForm;
  selectedSubject: Definition;
  subjects: Definition[];

  @Input() isSaving: boolean = false;

  @Output() sendForm = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private translate: TranslateService, private translationHelper: TranslationHelperService) {
  }

  private getControlsConfig() {
    return {
      subject: ['', [Validators.required]],
      comments: [''],
      soldToName: [''],
      vat: [''],
      address: [''],
      postalCode: [''],
      city: [''],
      country: [''],
      shipToName: [''],
      salesOrder: [''],
    }
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group(this.getControlsConfig());
    const getSubjectValue = (control: AbstractControl) => control.value.value;
    let conditionValues = [this.SUBJECT_ADDRESS_CHANGE, this.SUBJECT_CHANGE_CUSTOMER_REF, this.SUBJECT_CHANGE_LANGUAGE, this.SUBJECT_CHANGE_ORDER, this.SUBJECT_REPORT_STOCK_PROBLEMS, this.SUBJECT_REQUEST_EXTRA_USERS];
    util.conditionalValidation(this.contactForm, 'comments', [util.createCondition('subject', conditionValues, getSubjectValue)], [Validators.required]);

    // sold to
    util.conditionalValidation(this.contactForm, 'soldToName', [util.createCondition('subject', [this.SUBJECT_ADD_SOLDTO], getSubjectValue)], [Validators.required]);
    util.conditionalValidation(this.contactForm, 'vat', [util.createCondition('subject', [this.SUBJECT_ADD_SOLDTO], getSubjectValue)], [Validators.required]);

    // ship to
    util.conditionalValidation(this.contactForm, 'shipToName', [util.createCondition('subject', [this.SUBJECT_ADD_SHIPTO], getSubjectValue)], [Validators.required]);

    // sold to & ship to
    util.conditionalValidation(this.contactForm, 'address', [util.createCondition('subject', [this.SUBJECT_ADD_SHIPTO, this.SUBJECT_ADD_SOLDTO], getSubjectValue)], [Validators.required]);
    util.conditionalValidation(this.contactForm, 'postalCode', [util.createCondition('subject', [this.SUBJECT_ADD_SHIPTO, this.SUBJECT_ADD_SOLDTO], getSubjectValue)], [Validators.required]);
    util.conditionalValidation(this.contactForm, 'city', [util.createCondition('subject', [this.SUBJECT_ADD_SHIPTO, this.SUBJECT_ADD_SOLDTO], getSubjectValue)], [Validators.required]);
    util.conditionalValidation(this.contactForm, 'country', [util.createCondition('subject', [this.SUBJECT_ADD_SHIPTO, this.SUBJECT_ADD_SOLDTO], getSubjectValue)], [Validators.required]);

    // change order
    util.conditionalValidation(this.contactForm, 'salesOrder', [util.createCondition('subject', [this.SUBJECT_CHANGE_ORDER], getSubjectValue)], [Validators.required]);

    this.translationHelper.translateArray(this.subjectKeys, (value, translation, index) => {
      return { id: index + 1 + '', value, name: translation };
    }, 'SERVICE.CONTACT.DROPDOWN.',).subscribe(array => (this.subjects = array));
  }

  subjectSelected() {
    this.selectedSubject = this.subjects.find(subject => subject.id == this.contactForm.get('subject').value.id);
  }

  submitForm(contactForm) {
    this.resetForm();

    this.sendForm.emit(contactForm);
  }

  resetForm() {
    this.contactForm = this.formBuilder.group(this.getControlsConfig());
  }
  submitClickedFn() {
    if (!this.contactForm.invalid) {
      this.submitForm(this.contactForm)
    }
  }
}

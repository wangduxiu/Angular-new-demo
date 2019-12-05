import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Definition } from "../../../../core/store/definitions/definition.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'admin-i18n-selector',
  templateUrl: './i18n-selector.html',
  styleUrls: ['./i18n-selector.less'],
})
export class I18nSelector implements OnInit {

  private JSON = '1 language in JSON';
  private CSV = 'All in excel copy/paste format';

  types = [this.CSV, this.JSON];
  languageOptions: Definition[];
  type = this.CSV;

  @Input() languages: Definition[];
  @Input() usedLanguage: string;
  @Input() loading: boolean;
  @Input() saving: boolean;

  @Output() editLanguage = new EventEmitter<string>();
  @Output() editAllCsv = new EventEmitter<string>();
  @Output() testLanguage = new EventEmitter<string>();
  @Output() resetLanguages = new EventEmitter<string>();

  i18nSelectorForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.i18nSelectorForm = this.formBuilder.group({
      language: [this.usedLanguage, [Validators.required]],
      type: [this.type]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  isCsv() {
    return this.i18nSelectorForm.get('type').value === this.CSV;
  }
  isJson() {
    return this.i18nSelectorForm.get('type').value === this.JSON;
  }
  preventRouting(event) {
    event.stopPropagation();
  }


}

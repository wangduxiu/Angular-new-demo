import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'admin-i18n-json-editor',
  templateUrl: './i18n-json-editor.html',
  styleUrls: ['./i18n-json-editor.less'],
})
export class I18nJsonEditor implements OnInit {

  @ViewChild('jsonField') jsonField: ElementRef;

  @Input() json: string;
  @Input() errorMessage: string;
  @Input() valid: boolean;
  @Input() edit: boolean;
  @Input() loading: boolean;
  @Input() saving: boolean;

  @Output() validate = new EventEmitter<string>();
  @Output() save = new EventEmitter<string>();

  dirty: boolean = false;

  ngOnInit(): void {
  }

  private flatten() {

  }

  private structurize() {

  }

  saveClicked(event) {
    event.stopPropagation();
    if (!this.loading && !this.saving) {
      this.dirty = false;
      this.save.emit(this.jsonField.nativeElement.value);
    }
  }


  validateClicked(event) {
    event.stopPropagation();
    if (!this.loading && !this.saving) {
      this.dirty = false;
      this.validate.emit(this.jsonField.nativeElement.value);
    }
  }

}

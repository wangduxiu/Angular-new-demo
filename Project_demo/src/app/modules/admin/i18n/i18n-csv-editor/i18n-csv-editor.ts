import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'admin-i18n-csv-editor',
  templateUrl: './i18n-csv-editor.html',
  styleUrls: ['./i18n-csv-editor.less'],
})
export class I18nCsvEditor implements OnInit {

  @ViewChild('csvField') csvField: ElementRef;

  @Input() csv: string;
  @Input() errorMessage: string;
  @Input() valid: boolean;
  @Input() edit: boolean;
  @Input() loading: boolean;
  @Input() saving: boolean;

  @Output() save = new EventEmitter<string>();

  dirty: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.csv) {
      this.csvField && (this.csvField.nativeElement.value = this.csv);
    }
  }

  private flatten() {

  }

  private structurize() {

  }

}

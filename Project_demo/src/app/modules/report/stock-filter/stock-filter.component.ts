import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../core/services/validator.service';
import { util } from '../../../core/util/util';
import * as _ from 'typedash';
import { TranslateService } from '@ngx-translate/core';
import { Place } from '../../../core/store/florders/place.interface';

@Component({
  selector: 'app-stock-filter',
  templateUrl: './stock-filter.component.html',
  styleUrls: ['./stock-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class StockFilterComponent implements OnInit {

  filterForm: FormGroup;

  @Input() locations: Place[];

  @Input() isLoading: boolean;

  @Output() filterStock = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private validatorService: ValidatorService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.createForm();
    this.initLocations();
  }

  createForm() {
    const controlsConfig = this.getControlsConfig();
    this.filterForm = this.formBuilder.group(controlsConfig);
  }

  private initLocations() {
    if (this.filterForm && this.locations && this.locations.length == 1 && this.filterForm.get('location')) {
      this.filterForm.get('location').setValue(this.locations[0].id);

      this.filterStock.emit(this.filterForm);
    }
  }

  private getControlsConfig() {
    return {
      location: ['', [Validators.required]],
    };
  }

  filterClicked() {
    if (!this.filterForm.invalid && !this.isLoading) {
      this.filterStock.emit(this.filterForm);
    }
  }
}

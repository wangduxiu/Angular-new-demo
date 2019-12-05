import { ChangeDetectionStrategy, Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ValidatorService } from '../../../core/services/validator.service';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { FlorderFilterComponent } from '../../florders/florder-filter/florder-filter.component';

@Component({
  selector: 'app-relocation-filter',
  templateUrl: './relocation-filter.component.html',
  styleUrls: ['../../florders/florder-filter/florder-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush // don't always check for changes, only when input changed (but there's no input here)
})
export class RelocationFilterComponent extends FlorderFilterComponent implements OnInit, OnChanges {

  @Output() filterRelocations = new EventEmitter<{ value: FlordersFilter; valid: boolean }>();

  palletIds: Definition[];

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, private translate: TranslateService) {
    super(formBuilder, validatorService);
  }

  protected getControlsConfig() {
    const controlsConfig = super.getControlsConfig();
    Object.assign(controlsConfig, {
      orderTypes: [this.filter.orderTypes],
      palletIds: [this.filter.palletIds],
      transporter: [this.filter.transporter],
      orderStatuses: [this.filter.orderStatuses],
    });
    return controlsConfig;
  }

  filterClicked(): void {
    super.filterClicked(this.filterRelocations);
  }
}

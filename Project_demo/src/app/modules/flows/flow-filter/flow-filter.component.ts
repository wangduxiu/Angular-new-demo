import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { ValidatorService } from '../../../core/services/validator.service';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';
import { FlorderFilterComponent } from '../../florders/florder-filter/florder-filter.component';

@Component({
  selector: 'app-flow-filter',
  templateUrl: './flow-filter.component.html',
  styleUrls: ['../../florders/florder-filter/florder-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
  animations: [
    trigger('growInOut', [
      state('in', style({ height: '50px' })),
      transition('void => *', [
        style({ height: 0 }),
        animate(400),
      ]),
      transition('* => void', [
        animate(400, style({ height: 0 })),
      ]),
    ]),
  ],
})
export class FlowFilterComponent extends FlorderFilterComponent implements OnInit, OnChanges {

  @Input() filterValues: FilterValues;
  @Output() filterFlows = new EventEmitter<{ value: FlordersFilter; valid: boolean }>();

  fromError: String;
  toError: String;

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, private translate: TranslateService) {
    super(formBuilder, validatorService);
  }

  protected getControlsConfig() {
    const controlsConfig = super.getControlsConfig();
    Object.assign(controlsConfig, {
      flowTypes: [this.filter.flowTypes],
      clearingYes: [this.filter.clearingYes],
      clearingNo: [this.filter.clearingNo],
      handshakeDateFrom: [this.filter.handshakeDateFrom, [this.validatorService.datePatternValidator]],
      handshakeDateTo: [this.filter.handshakeDateTo, [this.validatorService.datePatternValidator, this.validatorService.dateSameOrAfter('handshakeDateFrom')]],
      flowStatuses: [this.filter.flowStatuses],
    });
    return controlsConfig;
  }

  filterClicked(): void {
    super.filterClicked(this.filterFlows);
  }

}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from '../../../core/services/validator.service';
import { CalendarFilter } from '../../../core/store/calendar/calendar-filter.interface';
import { AuthorizationMatrixTO } from '../../../core/store/contract-details/contract-details.interface';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { Place } from '../../../core/store/florders/place.interface';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';

@Component({
  selector: 'app-calendar-filter',
  templateUrl: './calendar-filter.component.html',
  styleUrls: ['./calendar-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class CalendarFilterComponent implements OnInit, OnChanges {
  isInitialized: boolean = false;

  filterForm: FormGroup;

  // private _definitions: Definitions;
  transport: { pickup: Definition, eps: Definition };
  orderType: { delivery: Definition, return: Definition, direct: Definition };

  @Input() authorization: AuthorizationMatrixTO;
  @Input() depots: Place[];
  @Input() filter: FlordersFilter;
  @Input() definitions: Definitions;

  @Output() filterCalendar = new EventEmitter<FlordersFilter>();

  constructor(private formBuilder: FormBuilder, private validatorService: ValidatorService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.isInitialized = true;
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.definitions) {
      if(this.isInitialized) {
        this.setTypes();
      }
    }
  }

  createForm() {
    const controlsConfig = this.getControlsConfig();
    this.filterForm = this.formBuilder.group(controlsConfig);

    this.filterForm.valueChanges.map(data => this.filterForm.value).distinctUntilChanged().subscribe((formData: CalendarFilter) => {
      const orderTypes = [];
      if (formData.orderTypeDelivery) {
        orderTypes.push('EPS-CUS');
      }
      if (formData.orderTypeReturn) {
        orderTypes.push('CUS-EPS');
      }
      if (formData.orderTypeDirect) {
        orderTypes.push('CUS-CUS-DS');
      }

      const shippingConditions = [];
      if (formData.transportEps) {
        shippingConditions.push('Z1');
      }
      if (formData.transportPickup) {
        shippingConditions.push('Z2');
      }

      const filter: FlordersFilter = {
        ...this.filter,
        orderTypes,
        depots: formData.depot !== 'all' ? [formData.depot] : [],
        shippingCondition: shippingConditions.length === 1 ? shippingConditions[0] : 'all',
      };
      this.filterCalendar.emit(filter);
    });
  }

  setTypes(): void {
    this.transport = {
      eps: this.definitions.transport.type.find(def => def.id.toLowerCase() === 'z1'),
      pickup: this.definitions.transport.type.find(def => def.id.toLowerCase() === 'z2'),
    };

    this.orderType = {
      delivery: this.definitions.order.type.find(def => def.id.toUpperCase() === 'EPS-CUS'),
      return: this.definitions.order.type.find(def => def.id.toUpperCase() === 'CUS-EPS'),
      direct: this.definitions.order.type.find(def => def.id.toUpperCase() === 'CUS-CUS-DS'),
    };
  }

  private getControlsConfig() {
    return {
      depot: ['all'],
      orderTypeDelivery: [true],
      orderTypeReturn: [true],
      orderTypeDirect: [true],
      transportPickup: [true],
      transportEps: [true],
    };
  }
}

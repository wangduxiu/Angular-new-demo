import { Component, Input, OnInit } from '@angular/core';
import { Definition } from '../../core/store/definitions/definition.interface';

export type Layout = 'BULLET' | 'ICON';

const statusses = {
  FLOW_01: 'no_difference',
  FLOW_02: 'waiting',
  FLOW_03: 'with_difference',
  FLOW_04: 'new_cancelled',
  FLOW_05: 'no_difference',
  ORDER_01: 'order_acknowkledge',
  ORDER_02: 'order_confirmed',
  ORDER_03: 'order_cancelled',
  ORDER_04: 'order_packed',
  ORDER_05: 'order_shipped',
  ORDER_06: 'order_invoiced',
  ORDER_07: 'waiting',
  ORDER_08: 'waiting',
  ORDER_09: 'approved',
  DEPOT: 'depot',
  STOCK: 'stock',
};

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.less'],
})
export class StatusComponent implements OnInit {

  @Input()
  private mode: 'order' | 'flow';

  @Input()
  private type: Definition;

  @Input()
  private layout: Layout = 'BULLET';

  @Input()
  private key: string;

  @Input()
  private size: 1 | 2 | 3 = 1;

  @Input() width: number = 0;

  @Input() height: number = 0;

  @Input()
  private position: string = 'below';

  imageUrl: string;

  constructor() {
  }

  ngOnInit() {
    this.key = this.key || this.type && this.mode && `${this.mode.toUpperCase()}_${this.type.id}`;
    if (this.key) {
      this.imageUrl = `../assets/img/${statusses[this.key]}/${this.layout === 'BULLET' ? '1' : '2'}_${statusses[this.key]}${this.size > 1 ? '@' + this.size + 'x' : ''}.png`;
    } else {
      this.imageUrl = null;
    }
  }

}

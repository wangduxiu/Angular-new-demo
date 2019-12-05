import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { easeInOutTrigger } from 'app/animations';
import { AuthorizationMatrix } from 'app/core/store/contract-details/contract-details.interface';

@Component({
  selector: 'admin-user-edit-buttons',
  templateUrl: './user-edit-buttons.component.html',
  styleUrls: ['./user-edit-buttons.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
  animations: [easeInOutTrigger('easeInOut', 0)],
})
export class UserEditButtonsComponent {

  @Input() userId: string;
  @Input() authorization: AuthorizationMatrix;
  @Input() reInviting: boolean;
  @Input() resettingPassword: boolean;
  @Input() disabled: boolean;

  @Output() reInvite: EventEmitter<string> = new EventEmitter();
  @Output() resetPassword: EventEmitter<string> = new EventEmitter();

}

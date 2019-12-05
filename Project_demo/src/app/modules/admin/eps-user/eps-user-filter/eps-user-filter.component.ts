import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserFilterComponent } from '../../abstract-user/user-filter/user-filter.component';

@Component({
  selector: 'admin-eps-user-filter',
  templateUrl: './eps-user-filter.component.html',
  styleUrls: ['../../abstract-user/user-filter/user-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class EpsUserFilterComponent extends UserFilterComponent implements OnInit {

  @Input() isLoading: boolean;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected getControlsConfig(){
    return Object.assign(super.getControlsConfig(), {
      isAdmin: [true],
      isNotAdmin: [true],
    });
  }

  filterClicked(): void {
    if (!this.isLoading) {
      this.filterUsers.emit(this.userFilterForm);
    }
  }
}

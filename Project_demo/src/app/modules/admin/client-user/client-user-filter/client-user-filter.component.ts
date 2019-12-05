import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFilterComponent } from '../../abstract-user/user-filter/user-filter.component';

@Component({
  selector: 'admin-client-user-filter',
  templateUrl: './client-user-filter.component.html',
  styleUrls: ['../../abstract-user/user-filter/user-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class ClientUserFilterComponent extends UserFilterComponent implements OnInit {

  @Input() isLoading: boolean;

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  filterClicked(): void {
    if (!this.isLoading) {
      this.filterUsers.emit(this.userFilterForm);
    }
  }
}

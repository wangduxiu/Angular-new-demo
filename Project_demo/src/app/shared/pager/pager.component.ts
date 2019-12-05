import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Definition} from '../../core/store/definitions/definition.interface';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.less'],
})
export class PagerComponent implements OnInit {


  itemsPerPageOptions: Definition[];

  form: FormGroup;
  @Input() itemsPerPage = 25;
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder) {
    this.itemsPerPageOptions = [10, 25, 50, 100, this.itemsPerPage]
      .sort((a, b) => a - b)
      .filter((nr, i, array) => array.indexOf(nr) === i)
      .filter(nr => nr >= this.itemsPerPage)
      .map(nr => `${nr}`)
      .map(nr => {
        return {id: nr, name: nr};
      });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      itemsPerPage: [`${this.itemsPerPage}`]
    });
  }

}

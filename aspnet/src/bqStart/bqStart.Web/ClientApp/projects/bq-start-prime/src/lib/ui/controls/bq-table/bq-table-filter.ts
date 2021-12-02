import { Component, Input, OnInit } from '@angular/core';
import { MetadataField, Predicate } from '../../../models/meta-data';

@Component({
  selector: 'bq-table>bq-table-filter',
  template: ``
})

export class TableFilter implements OnInit {

  @Input()
  field: MetadataField;

  @Input()
  caption: string;

  @Input()
  defaultSearchField: boolean = false;

  @Input()
  showTime: boolean = false;

  defaultPredicate:Predicate;

  constructor() { }

  ngOnInit() {
    if (this.field){
      if (!this.caption){
        this.caption = this.field.caption;
      }
      this.defaultPredicate = this.field.typeSystem?.predicates[0];
    }
  }
}

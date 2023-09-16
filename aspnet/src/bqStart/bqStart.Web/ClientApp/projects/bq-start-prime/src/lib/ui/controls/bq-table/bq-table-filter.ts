import { Component, Input, OnInit } from '@angular/core';
import { MetadataField, Predicate } from '../../../models/meta-data';

@Component({
  selector: 'bq-table>bq-table-filter',
  template: ``,
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

  /**
   * If this filter will display values from a predefined list, like a dropdown box
   * then setup the source here
   * @type {any[]}
   * @memberof TableFilter
   */
  @Input()
  itemSource: any[];
  /**
   * what display property to use for the dropdown values
   *
   * @type {string}
   * @memberof TableFilter
   */
  @Input()
  displayName: string;
  /**
   * value property to use for dropdown values
   *
   * @type {string}
   * @memberof TableFilter
   */
  @Input()
  valueName: string;

  defaultPredicate: Predicate;

  constructor() {}

  ngOnInit() {
    if (this.field) {
      if (!this.caption) {
        this.caption = this.field.caption;
      }
      this.defaultPredicate = this.field.typeSystem?.predicates[0];
    }
  }
}

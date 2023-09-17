import { Component, Input, OnInit } from '@angular/core';
import { MetadataField, Predicate } from '../../../models/meta-data';

/**
 * Defines a filter in a bq-table component
 *
 * @export
 * @class TableFilter
 * @implements {OnInit}
 */
@Component({
  selector: 'bq-table>bq-table-filter',
  template: ``,
})
export class TableFilter implements OnInit {
  /**
   * Field metadata
   *
   * @type {MetadataField}
   * @memberof TableFilter
   */
  @Input()
  field: MetadataField;

  /**
   * Optional, Caption of the field
   *
   * @type {string}
   * @memberof TableFilter
   */
  @Input()
  caption: string;

  /**
   * If true then appears under the default search text box as an option
   *
   * @type {boolean}
   * @memberof TableFilter
   */
  @Input()
  defaultSearchField: boolean = false;

  /**
   * If the value to display is a TIME type
   *
   * @type {boolean}
   * @memberof TableFilter
   */
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

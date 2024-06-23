import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MetadataField } from "bq-start-core";

/**
 * Represents a column layout for the Table
 *
 * @export
 * @class TableColumn
 * @implements {OnInit}
 */
@Component({
  selector: 'bq-table>bq-table-column',
  template: ``})
export class TableColumn implements OnInit {

  /**
   * What will be metadata for this column
   *
   * @type {MetadataField}
   * @memberof TableColumn
   */
  @Input()
  field: MetadataField;

  /**
   * Optional, Caption
   *
   * @type {string}
   * @memberof TableColumn
   */
  @Input()
  caption: string;

  /**
   * Optional, Cell Template to use instead of default value display
   *
   * @type {TemplateRef<any>}
   * @memberof TableColumn
   */
  @Input()
  cellTemplate: TemplateRef<any>;

  /**
   * This column will be sortable on the table
   *
   * @type {boolean}
   * @memberof TableColumn
   */
  @Input()
  allowSort: boolean;

  /**
   * Optional, Sorting property name
   *
   * @type {(string | null)}
   * @memberof TableColumn
   */
  @Input()
  sortName: string | null = null;

  /**
   * Optional, header style class
   *
   * @type {(string | null)}
   * @memberof TableColumn
   */
  @Input()
  headerStyle: string | null = null;

  /**
   * Optional, cell css class
   *
   * @type {(string | null)}
   * @memberof TableColumn
   */
  @Input()
  cellStyle: string | null = null;

  constructor() { }

  ngOnInit(): void {
    if (this.sortName === null && this.allowSort === true && (this.field !== undefined && this.field !== null )){
      this.sortName = this.field.name;
    }
    if (this.allowSort === true && this.sortName === null){
      console.warn("allowSort to true but sortName or field not specified");
    }
    if (this.field){
      if (!this.caption){
        this.caption = this.field.caption;
      }
    }
  }


}

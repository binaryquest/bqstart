import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MetadataField } from "../../../models/meta-data";

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

  @Input()
  field: MetadataField;

  @Input()
  caption: string;

  @Input()
  cellTemplate: TemplateRef<any>;

  @Input()
  allowSort: boolean;

  @Input()
  sortName: string | null = null;

  @Input()
  headerStyle: string | null = null;

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

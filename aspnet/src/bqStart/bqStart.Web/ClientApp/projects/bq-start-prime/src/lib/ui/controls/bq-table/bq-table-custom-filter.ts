import { Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { FilterByClause } from '../../../models/table-data';
import { TableFilter } from './bq-table-filter';
import { Predicate, PREDICATE_EQUALS, PREDICATE_ISNOTNULL, PREDICATE_ISNULL } from '../../../models/meta-data';
import { InternalLogService } from '../../../services/log/log.service';
import { DateTime } from 'luxon';
import { DropdownChangeEvent } from 'primeng/dropdown';


/**
 * This component is used internally in bq-table
 *
 * @export
 * @class CustomFilter
 * @implements {OnInit}
 */
@Component({
  selector: 'bq-table-custom-filter',
  templateUrl: './bq-table-custom-filter.html',
  styles: [
    `:host ::ng-deep .ng-invalid { border-color: #f44336; }
     :host ::ng-deep .ng-invalid input { border-color: #f44336; }
     :host ::ng-deep .ng-valid { border-color: #36F4C5; }
     :host ::ng-deep .ng-valid input { border-color: #36F4C5; }
    `
  ]
})

export class CustomFilter implements OnInit {

  @Input()
  filterClause: FilterByClause;

  @Input()
  filters: TableFilter[];

  @Input()
  formName: string;

  selectedFilter: TableFilter;
  selectedPredicate: Predicate;

  value: any;
  toValue: any;
  showValue: boolean = true;
  showToValue: boolean = false;
  showDropDownValue: boolean = false;
  showEquals = [PREDICATE_EQUALS];

  boolValues = [
    { display: 'is true', value: true },
    { display: 'is false', value: false }
  ];

  @Output()
  remove = new EventEmitter<CustomFilter>();

  localeFormat: string;

  constructor() {
    this.localeFormat = "dd-mm-yy"//moment.localeData().longDateFormat('L').toLowerCase().replace('yyyy', 'yy');
  }

  ngOnInit(): void {
    if (this.filters && this.filters.length > 0) {
      this.selectedFilter = this.filters[0];
      this.fieldUpdated(this.selectedFilter);
    }
  }

  fieldUpdated(newVal: TableFilter) {
    this.value = null;
    this.toValue = null;
    this.selectedPredicate = newVal.field.typeSystem.predicates[0];
    this.showDropDownValue = (newVal.itemSource !== undefined);
    this.showValue = this.selectedPredicate.key !== PREDICATE_ISNULL.key && this.selectedPredicate.key !== PREDICATE_ISNOTNULL.key && this.showDropDownValue === false;
    this.showToValue = this.selectedPredicate.hasSecondParam;
    this.filterClause.Caption = newVal.caption ?? newVal.field.caption;
    this.filterClause.DataType = newVal.field.dataType;
    this.filterClause.FieldName = newVal.field.name;
    this.filterClause.Predicate = this.selectedPredicate.key;
    this.predicateUpdated(this.selectedPredicate, newVal);
  }

  predicateUpdated(newVal: Predicate, selFilter: TableFilter) {
    if (newVal) {
      this.showValue = newVal.key !== PREDICATE_ISNULL.key && newVal.key !== PREDICATE_ISNOTNULL.key;
      this.showToValue = newVal.hasSecondParam;
      this.filterClause.Predicate = newVal.key;
      if (selFilter) {
        if (selFilter.field.dataType == "Boolean") {
          this.valueUpdated(this.boolValues[0].value);
        }
        else if (selFilter.field.dataType == "Enum") {
          try {
            this.valueUpdated(selFilter.field.enums[0].name);
          } catch (error) {
            InternalLogService.logger().warn('enum array is empty');
          }
        }
      }
    }
  }

  valueUpdated(newVal: any) {
    this.value = newVal;
    this.filterClause.Value = newVal;
    this.filterClause.DisplayValue = newVal;

    if (this.showDropDownValue){
      //lets find display value from list
      let item = this.selectedFilter.itemSource.find(x => x[this.selectedFilter.valueName]===newVal);
      if (item){
        this.filterClause.DisplayValue = item[this.selectedFilter.displayName];
      }
    }

    if (this.selectedFilter.field.dataType == "DateTime") {
      if (this.selectedFilter.showTime) {
        const dt = DateTime.fromJSDate(newVal);
        this.filterClause.DisplayValue = dt.toLocaleString(DateTime.DATETIME_MED);
      }else{
        this.filterClause.Value = DateTime.fromJSDate(newVal).startOf('day').toJSDate();
        this.filterClause.DisplayValue = DateTime.fromJSDate(newVal).startOf('day').toLocaleString(DateTime.DATE_MED);
        //console.log("filter updated", this.filterClause);
      }
    }
  }

  valueToUpdated(newVal: any) {
    this.toValue = newVal;
    this.filterClause.ToValue = newVal;
    this.filterClause.ToDisplayValue = newVal;

    if (this.selectedFilter.field.dataType == "DateTime") {
      if (this.selectedFilter.showTime) {
        const dt = DateTime.fromJSDate(newVal);
        this.filterClause.ToDisplayValue = dt.toLocaleString(DateTime.DATETIME_MED);
      }else{
        this.filterClause.ToValue = DateTime.fromJSDate(newVal).startOf('day').toJSDate();
        this.filterClause.ToDisplayValue = DateTime.fromJSDate(newVal).startOf('day').toLocaleString(DateTime.DATE_MED);
      }
    }
  }

}

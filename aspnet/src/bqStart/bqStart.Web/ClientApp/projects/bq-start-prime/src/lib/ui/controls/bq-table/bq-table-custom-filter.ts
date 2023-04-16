import { Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { FilterByClause } from '../../../models/table-data';
import { TableFilter } from './bq-table-filter';
import { Predicate, PREDICATE_ISNOTNULL, PREDICATE_ISNULL } from '../../../models/meta-data';
import { InternalLogService } from '../../../services/log/log.service';
import { DateTime } from 'luxon';


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
  filterCluase: FilterByClause;

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
    this.showValue = this.selectedPredicate.key !== PREDICATE_ISNULL.key && this.selectedPredicate.key !== PREDICATE_ISNOTNULL.key;
    this.showToValue = this.selectedPredicate.hasSecondParam;
    this.filterCluase.Caption = newVal.caption ?? newVal.field.caption;
    this.filterCluase.DataType = newVal.field.dataType;
    this.filterCluase.FieldName = newVal.field.name;
    this.filterCluase.Predicate = this.selectedPredicate.key;
    this.predicateUpdated(this.selectedPredicate, newVal);

  }

  predicateUpdated(newVal: Predicate, selFilter: TableFilter) {
    if (newVal) {
      this.showValue = newVal.key !== PREDICATE_ISNULL.key && newVal.key !== PREDICATE_ISNOTNULL.key;
      this.showToValue = newVal.hasSecondParam;
      this.filterCluase.Predicate = newVal.key;
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
    this.filterCluase.Value = newVal;
    this.filterCluase.DisplayValue = newVal;

    if (this.selectedFilter.field.dataType == "DateTime") {
      if (!this.selectedFilter.showTime) {
        this.filterCluase.Value = DateTime.fromISO(newVal).startOf('day').toJSDate();
        this.filterCluase.DisplayValue = DateTime.fromISO(newVal).startOf('day').toLocaleString(DateTime.DATETIME_MED);
      }else{
        this.filterCluase.DisplayValue = DateTime.fromISO(newVal).startOf('day').toLocaleString(DateTime.DATE_MED);
      }
    }
  }

  valueToUpdated(newVal: any) {
    this.toValue = newVal;
    this.filterCluase.ToValue = newVal;
    this.filterCluase.ToDisplayValue = newVal;

    if (this.selectedFilter.field.dataType == "DateTime") {
      if (!this.selectedFilter.showTime) {
        this.filterCluase.ToValue = DateTime.fromISO(newVal).startOf('day').toJSDate();
        this.filterCluase.ToDisplayValue = DateTime.fromISO(newVal).startOf('day').toLocaleString(DateTime.DATETIME_MED);
      }else{
        this.filterCluase.ToDisplayValue = DateTime.fromISO(newVal).startOf('day').toLocaleString(DateTime.DATE_MED);
      }
    }
  }
}

import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ContentChildren, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnDestroy, OnInit, Optional, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table as ngTable } from 'primeng/table';
import { Subscription } from 'rxjs';
import { MetadataField, ModelMetadata } from '../../../models/meta-data';
import { OrderByClause, PredefinedFilter, TableParams } from '../../../models/table-data';
import { AppInitService } from '../../../services/app-init.service';
import { TableColumn } from './bq-table-column';
import { TableFilter } from './bq-table-filter';
import * as moment_ from 'moment';
const moment = moment_;

/**
 * Table Density Enum to Control the Visual State of the Table
 */
export enum TableDensity {
  Normal = 0,
  Compact = 1,
  Large = 2
}
/**
 * BQ Table Component
 *
 * @export
 * @class Table
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {OnChanges}
 */
@Component({
  selector: 'bq-table',
  templateUrl: './bq-table.html',
  styleUrls: ['./bq-table.scss']
})
export class Table implements OnInit, OnDestroy, OnChanges {

  /**
   * The model that table will bind to
   *
   * @type {any[]}
   * @memberof Table
   */
  @Input()
  model: any[];

  /**
   * Require the metadata from the view backend
   *
   * @type {ModelMetadata}
   * @memberof Table
   */
  @Input()
  metaData: ModelMetadata;

  /**
   * The Table Param object to act as bridge between the query params of the view
   * and the table
   * @type {TableParams}
   * @memberof Table
   */
  @Input()
  tableParams: TableParams;

  /**
   * if you want to customise the options column supply ur own template here
   *
   * @type {TemplateRef<any>}
   * @memberof Table
   */
  @Input()
  optionColumnTemplate: TemplateRef<any>;

  /**
   * if the columns width can be changed runtime using a mouse
   *
   * @type {boolean}
   * @memberof Table
   */
  @Input()
  resizableColumns: boolean;

  /**
   * if the table should have a flexible view or fixed column width
   *
   * @type {boolean}
   * @memberof Table
   */
  @Input()
  equalColumnWidth: boolean = true;

  @Input()
  loading: boolean = false;

  /**
   * The density of the table
   *
   * @type {TableDensity}
   * @memberof Table
   */
  @Input()
  density: TableDensity = TableDensity.Normal;

  /**
   * Should display the Grid Lines of tha table?
   *
   * @type {boolean}
   * @memberof Table
   */
  @Input()
  showGrid: boolean = false;

  /**
   * Should display Stripped background for alternate rows?
   *
   * @type {boolean}
   * @memberof Table
   */
  @Input()
  showStripedGrid: boolean = true;

  /**
   * Control whether to show or hide the options column
   *
   * @type {boolean}
   * @memberof Table
   */
  @Input()
  hideOptionsColumn: boolean;

  /**
   * When the table needs to reload data from server this event gets fired.
   * Typically you will load data from server on this event
   * @memberof Table
   */
  @Output() loadTableData = new EventEmitter<TableParams>();

  @ViewChild('internalTable', { static: true }) //the reason it's static as we need it access to this field inside ngOnInit
  internalTable: ngTable;

  @ContentChildren(TableColumn) columns: QueryList<TableColumn>;

  @ContentChildren(TableFilter) filters: QueryList<TableFilter>;

  @Input()
  predefinedFilters: PredefinedFilter[];

  @Input()
  showAddButton: boolean;

  //the total record count, not just the current page. gets returned by odata query
  count: number = 0;
  countSub: Subscription;
  styleClass: string;
  allowAdd: boolean;
  allowEdit: boolean;
  allowDetails: boolean;
  formViewId: string | undefined;
  tableParamsSub: Subscription;
  pageSizeOptions: number[];
  pageSize: number;

  constructor(@Inject(LOCALE_ID) private locale: string,
    private appInitService: AppInitService,
    private router: Router
  ) {
    this.pageSizeOptions = appInitService.runningConfig.viewDefaults?.otherPageSizes ?? [25, 50, 100];
    this.pageSize = appInitService.runningConfig.viewDefaults?.defaultPageSize ?? 50;
  }

  private internalInit() {
    this.styleClass = "p-datatable-gridlines";
    switch (+this.density) {
      case TableDensity.Compact:
        this.styleClass += " p-datatable-sm";
        break;
      case TableDensity.Large:
        this.styleClass += " p-datatable-lg";
        break;
      default:
        break;
    }
    if (this.showGrid) {
      this.styleClass += " p-datatable-gridlines";
    }
    if (this.showStripedGrid) {
      this.styleClass += " p-datatable-striped";
    }
  }

  ngOnInit(): void {
    this.internalInit();

    //work out the view links and details links
    const formViews = this.appInitService.runningConfig.formViewsByType[this.metaData.typeName] ?? [];
    this.formViewId = formViews.find(o => o)?.viewId;
    this.allowAdd = (formViews.length > 0 && this.metaData.allowAdd);
    this.allowDetails = (formViews.length > 0 && this.metaData.allowSelect);
    this.allowEdit = (formViews.length > 0 && this.metaData.allowEdit);

    if (this.tableParams) {
      this.countSub = this.tableParams.count.subscribe(s => {
        this.count = s;
      });

      //lets sync query string to internal table
      this.tableParamsSub = this.tableParams.getChanges().subscribe(_ => {
        //if our internal state is same as query then we load data
        if (this.isTableStateSyncedWithPrams()) {
          this.loadTableData.emit(this.tableParams);
        } else {
          //lets set internal table state for current page, sort etc and then load data
          this.syncWithTable();
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['density'] || changes['showGrid'] || changes['showStripedGrid']) {
      this.internalInit();
    }
  }

  ngOnDestroy(): void {
    if (this.countSub) {
      this.countSub.unsubscribe();
    }
    if (this.tableParamsSub) {
      this.tableParamsSub.unsubscribe();
    }
  }

  getKeyValue(rowData: any) {
    if (rowData) {
      return this.metaData.getPrimaryKeyAsRouteParam(rowData);
    } else {
      return '';
    }
  }

  getCellValue(rowData: any, field: MetadataField) {
    if (rowData) {
      return this.byString(rowData, field.name);
    } else {
      return null;
    }
  }

  getFormattedValue(rowData: any, field: MetadataField) {

    let value = this.getCellValue(rowData, field);

    if (!(value === undefined || value === null)) {
      if (field.dataType === "DateTime") {
        //const pipe = new DatePipe(this.locale);
        //const formattedDate = pipe.transform(value, this.getDateFormatFromColumnTemplate(field));
        const formattedDate = moment(value).format(field.dateFormat ?? 'L LTS');
        return formattedDate;
      } else if (field.dataType === "Boolean") {
        return (value ? 'True' : 'False');
      }
      return value;
    } else {
      return "";
    }
  }

  syncWithTable() {
    this.internalTable.first = this.tableParams.skip;
    if (this.tableParams.orderByCollection.length === 0) {
      this.internalTable._sortField = "";
      this.internalTable._sortOrder = this.internalTable.defaultSortOrder;
      this.internalTable._multiSortMeta = [];
      ///TODO: check following
      //this.internalTable.tableService.onSort("");
    } else {
      //we only allow one sorting
      const orderBy = this.tableParams.orderByCollection[0];
      this.internalTable.sortField = orderBy.FieldName;
      this.internalTable.sortOrder = orderBy.Dir == "desc" ? -1 : 1;
      this.internalTable.sortSingle();
    }
    this.loadTableData.emit(this.tableParams);
  }

  lazyLoadData(event: LazyLoadEvent) {
    let param = { top: event.rows, skip: event.first, orderBy: <OrderByClause | null>null };

    if (event.sortField) {
      param.orderBy = new OrderByClause();
      param.orderBy.FieldName = event.sortField;
      param.orderBy.Dir = event.sortOrder === -1 ? "desc" : "";
      param.orderBy.Caption = event.sortField; //TODO get proper caption
    }
    this.tableParams.gotoPage(param);
  }

  gotoEdit(row: any) {
    if (!this.allowEdit || !this.formViewId)
      return;

    const path = `view/${this.formViewId}/edit/${this.getKeyValue(row)}`;

    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  gotoDetails(row: any) {
    if (!this.allowDetails || !this.formViewId)
      return;

    const path = `view/${this.formViewId}/form/${this.getKeyValue(row)}`;

    this.router.navigate([path], { queryParamsHandling: 'merge' });

  }

  gotoAddNew(){
    if (!this.allowAdd || !this.formViewId)
    return;
    const path = `view/${this.formViewId}/add/-1`;
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  private isTableStateSyncedWithPrams() {
    let ret: boolean = true;
    if (this.internalTable.first != this.tableParams.skip) {
      ret = false;
    }
    if (this.internalTable.sortField !== undefined && this.internalTable.sortField !== null && this.tableParams.orderByCollection.length === 0) {
      ret = false;
    }
    if ((this.internalTable.sortField === undefined || this.internalTable.sortField === null) && this.tableParams.orderByCollection.length > 0) {
      ret = false;
    }
    return ret;
  }


  private byString(o:any, s:any) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
}

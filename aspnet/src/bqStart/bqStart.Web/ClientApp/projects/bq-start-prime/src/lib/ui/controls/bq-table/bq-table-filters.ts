import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild } from '@angular/core';
import { find, Subject, Subscription } from 'rxjs';
import { MetadataField, ModelMetadata, PREDICATE_CONTAINS, PREDICATE_EQUALS } from '../../../models/meta-data';
import { FilterByClause, PredefinedFilter, TableParams } from '../../../models/table-data';
import { MessageService, MessageType } from '../../../services/message.service';
import { TableFilter } from './bq-table-filter';
import { DomHandler } from 'primeng/dom';
//import { tap } from 'lodash';
import { relativeTimeRounding } from 'moment';
import { InternalLogService } from '../../../services/log/log.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bq-table-filters',
  templateUrl: './bq-table-filters.html',
  styleUrls: ['./bq-table-filters.scss']
})
export class TableFilters implements AfterViewInit, OnInit, OnDestroy {

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

  @Input()
  filters: QueryList<TableFilter>;

  @Input()
  predefinedFilters: PredefinedFilter[];

  @Input()
  showAddButton: boolean;

  @Output() addButtonClicked = new EventEmitter<boolean>();

  tableParamsSub: Subscription;
  appliedFilters: FilterByClause[];

  customFilters: FilterByClause[];

  showMenu: boolean;

  container: HTMLDivElement | null;
  isContainerClicked: boolean = true;
  documentClickListener: any;
  target: any;

  constructor(private msgSvc: MessageService, public el: ElementRef, public renderer: Renderer2, private zone: NgZone, private translate:TranslateService) { }

  ngAfterViewInit(): void {
    this.container = this.el.nativeElement.getElementsByClassName("bq-filter-overlay")[0];
    if (this.container && this.filters.length > 0) {
      this.bindDocumentClickListener();
    }
  }



  ngOnInit() {
    if (this.tableParams) {
      this.predefinedFilters = this.predefinedFilters ?? [];
      //lets sync query string to internal table
      this.tableParamsSub = this.tableParams.getChanges().subscribe(_ => {
        this.appliedFilters = this.tableParams.filterByCollection ?? [];
        if (this.filters.length > 0) {
          const firstFilter: TableFilter = this.filters.first;
          this.customFilters = [FilterByClause.GetDefault(firstFilter.caption, firstFilter.field)];
        } else {
          this.customFilters = [];
        }
        //map if predefined filters is selected
        try {
          this.predefinedFilters.map(pf => pf.isSelected = false);
          this.appliedFilters.map(f => {
            if (f.CustomName) {
              const findResult = this.predefinedFilters.find(ff => ff.filterName == f.CustomName);
              if (findResult !== undefined){
                findResult.isSelected = true;
              }
            }
          });
        } catch (error) {
          console.info('a custom filter in url found is not defined in predefined filters list');
        }
      });
    }
  }

  getDefaultFilterName(): TableFilter|null {
    if (this.filters) {
      let def: TableFilter[] = this.filters.filter(f => f.defaultSearchField);
      if (def && def.length > 0) {
        return def[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  clear() {
    this.appliedFilters = [];
    this.tableParams.clearFilters();
  }

  onAdd(event: { event: Event, value: string, selectedFilter: TableFilter }) {
    if (event.value) {
      const defFilter = event.selectedFilter ?? this.getDefaultFilterName();
      if (defFilter !== null) {
        if (defFilter.field.IsValidFilterData(event.value)) {
          const data = new FilterByClause();
          data.FieldName = defFilter.field.name;
          data.Caption = defFilter.caption;
          data.Predicate = PREDICATE_CONTAINS.key;
          if (defFilter.field.dataType !== "String") {
            data.Predicate = PREDICATE_EQUALS.key;
          }
          data.Value = event.value;
          data.DisplayValue = event.value;
          data.DataType = defFilter.field.dataType;
          this.tableParams.addFilter(data);
        } else {
          const translatedMsg = this.translate.instant("bq-start.filters.term-error", {'term':event.value, 'caption':defFilter.caption});
          //const msg = `Search Term ${event.value} is not valid for ${defFilter.caption}`;
          const translatedTitle = this.translate.instant("bq-start.filters.term-error-title");
          this.msgSvc.showMessage(translatedMsg, translatedTitle, MessageType.error);
          this.appliedFilters.pop();
        }
      } else {
        console.warn("no default filter selected");
        this.appliedFilters.pop();
      }
    }
  }

  onRemove(event: any) {
    if (event.value) {
      this.tableParams.removeFilter(event.value);
    }
  }

  toggleMenu() {
    this.isContainerClicked = true;
    this.showMenu = !this.showMenu;
  }

  addCondtion() {
    if (this.filters.length > 0) {
      const firstFilter: TableFilter = this.filters.first;
      this.customFilters.push(FilterByClause.GetDefault(firstFilter.caption, firstFilter.field));
    }
  }

  apply() {
    const validFilterClauses: FilterByClause[] = this.customFilters.filter(f => f.IsValid());
    if (validFilterClauses.length > 0) {
      console.log("set filter");
      this.tableParams.addFilters(validFilterClauses);
      this.showMenu = false;
    } else {
      this.msgSvc.showMessage("Please enter search term", "Input Error", MessageType.error);
    }
  }

  removeConditon(index: number) {
    console.log("remove here " + index);
    if (this.customFilters.length > index) {
      this.customFilters.splice(index, 1);
    }
  }

  onContainerClick() {
    this.isContainerClicked = true;
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.zone.runOutsideAngular(() => {
        let documentEvent = DomHandler.isIOS() ? 'touchstart' : 'click';
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

        this.documentClickListener = this.renderer.listen(documentTarget, documentEvent, (event) => {
          if (this.container!==null && !this.container.contains(event.target) && !this.isContainerClicked) {
            this.zone.run(() => {
              this.showMenu = false;
            });
          }

          this.isContainerClicked = false;
        });
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  ngOnDestroy(): void {
    //InternalLogService.logger.debug("TableFilters.ngOnDestroy", this.container);
    this.target = null;
    if (this.container) {
      this.unbindDocumentClickListener();
      this.container = null;
    }
  }

  pfMenuClicked(filter: PredefinedFilter, event: MouseEvent) {
    const pfc: FilterByClause = filter.GetFilterCluase();
    if (filter.isSelected) { //Remove
      const ef = this.appliedFilters.find(f => f.CustomName == filter.filterName);
      if (ef !== undefined){
        this.tableParams.removeFilter(ef);
      }
    }
    else{ //Add
      this.tableParams.addFilter(pfc);
    }
    this.showMenu = false;
  }

  gotoAddView(){
    this.addButtonClicked.next(true);
  }
}

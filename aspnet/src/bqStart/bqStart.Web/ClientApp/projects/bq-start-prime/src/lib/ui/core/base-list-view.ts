import { HttpClient } from "@angular/common/http";
import { Component, Inject, Injector, OnDestroy, OnInit, Optional } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormType, ViewData, ViewType } from "../../config/bq-start-config";
import { IBaseEvents, ModelMetadata, ViewOptionalData } from "../../models/meta-data";
import { FilterByClause, PredefinedFilter, TableParams } from "../../models/table-data";
import { DataServiceOptions, DataServiceToken, GenericDataService } from "../../services/generic-data.service";
import { InternalLogService } from "../../services/log/log.service";
import { RouterService } from "../../services/router.service";
import { BaseComponent } from "../base.component";



/**
 * Defines the base abstract functionality of a BQ View (List/Form)
 * and their various event methods that you can override in the implemented class
 * @export
 * @interface IBaseListViewEvents
 */
export declare interface IBaseListViewEvents extends IBaseEvents {
  /**
   * This method is called when a view is done initializing it's internal details.
   * Typically you can other initialiation functions here.
   * @memberof IBaseListViewEvents
   */
  onAfterInitComplete(): void;


  /**
   * This method is called when the veiw receives the data from the service.
   * The service populates the 'models' property.
   * @memberof IBaseListViewEvents
   */
  onAfterServerDataReceived(): void;
}


/**
 * Type Guard Functions for casting Interface Implementation Check runtime if
 * inherited classes has the events functions that can be called runtime
 */
function canCallAfterInitComplete(arg: Object): arg is IBaseListViewEvents {
  return (arg as IBaseListViewEvents).onAfterInitComplete !== undefined;
}

function canCallAfterServerDataReceived(arg: Object): arg is IBaseListViewEvents {
  return (arg as IBaseListViewEvents).onAfterServerDataReceived !== undefined;
}

@Component({
  template: '',
})
export class BaseListView<TModel> extends BaseComponent implements OnInit, OnDestroy {

  metaData: ModelMetadata;
  viewDef: ViewData;
  formType: FormType;
  tableParams: TableParams;


  /**
   * The property holds the server side model data that is loaded via
   * the generic service.
   * @type {TModel[]}
   * @memberof BaseListView
   */
  models: TModel[];

  /**
   * Use this to define named/predefined filters that
   * will be displayed on the filters menu.
   * A predefined filter does not require input from user.
   * Useful for filter data based on known values, e.g.
   * showing if a field is not null.
   *
   * @type {PredefinedFilter[]}
   * @memberof BaseListView
   */
  predefinedFilters: PredefinedFilter[];

  /**
   * Display the App New button inside the BQTable of it's child component
   *
   * @type {boolean}
   * @memberof BaseListView
   */
  showAddButton: boolean;

  protected dataSvc: GenericDataService | null;

  constructor(protected routerSvc: RouterService,
    @Inject('viewOptionalData') @Optional() private optionalData: ViewOptionalData) {
    super();

    this.metaData = routerSvc.metaData;
    this.viewDef = routerSvc.viewDef;
    this.formType = routerSvc.formType;

    const dataServiceOptions: DataServiceOptions = {
      $type: this.metaData?.typeName
    };


    if (this.metaData && optionalData) {
      dataServiceOptions.$expandClause = optionalData.$expandClause;
      dataServiceOptions.$selectClause = optionalData.$selectClause;
    }

    const injector =
      Injector.create({providers: [{provide: DataServiceToken, useValue:dataServiceOptions}], parent: this.injector},);

    this.dataSvc = injector.get(GenericDataService);

    if (this.formType == FormType.List) {
      this.tableParams = new TableParams(this.routerSvc, this.appInitService);
    }else{
      throw new Error('Wrong View Form Type in View Defintions');
    }

    this.predefinedFilters = [];

    //work out whether we show Add New button or not
    this.showAddButton = false;
    if (this.metaData.allowAdd){
      const formView = this.config.views.filter(aView => aView.typeName == this.viewDef.typeName && aView.viewType == ViewType.Form);
      this.showAddButton = formView.length>0;
    }
  }

  ngOnInit(): void {
    InternalLogService.logger().debug(`BaseListView::ngOnInit`);

    if (canCallAfterInitComplete(this)) {
      this.onAfterInitComplete();
    }

  }

  ngOnDestroy(): void {
    InternalLogService.logger().debug("BaseListView::ngOnDestroy");

    if (this.tableParams) {
      this.tableParams.destroy();
    }
    if (this.dataSvc){
      this.dataSvc.ngOnDestroy();
      this.dataSvc = null;
    }
  }


  private loadServerData() {
    InternalLogService.logger().debug("BaseListView::loadServerData");

    setTimeout(() => this.isLoading = true, 0);
    this.dataSvc?.getAll<TModel>(this.tableParams).subscribe(
      {
        next: data =>{
          setTimeout(() => this.isLoading = false, 100);
          this.models = data.entities;
          this.tableParams.serverDataLoaded<TModel>(data);
          if (canCallAfterServerDataReceived(this)) {
            this.onAfterServerDataReceived();
          }
          this.showInfo(this.i18("bq-start.messages.dataLoaded"));
        },
        error: this.errHandler.bind(this)
      }
    );
  }

  onRefreshData() {
    this.loadServerData();
  }
}

import { HttpClient } from "@angular/common/http";
import { Component, Inject, Injector, OnDestroy, OnInit, Optional } from "@angular/core";
import { FormType, ViewData, ViewType } from "bq-start-core";
import { IBaseEvents, ModelMetadata, ViewOptionalData } from "bq-start-core";
import { FilterByClause, PredefinedFilter, TableParams } from "../../models/table-data";
import { DataServiceOptions, DataServiceToken, GenericDataService } from "../../services/generic-data.service";
import { InternalLogService } from "../../services/log/log.service";
import { RouterService } from "../../services/router.service";
import { BaseComponent } from "../base.component";
import { IBaseView } from "./base-view";
import { AppInjector } from "../../services/app-injector.service";

/**
 * Defines the base abstract functionality of a BQ View (List/Form)
 * and their various event methods that you can override in the implemented class
 * @export
 * @interface IBaseListViewEvents
 */
export declare interface IBaseListViewEvents extends IBaseEvents {
  /**
   * This method is called when a view is done initializing it's internal details.
   * Typically you can other initialization functions here.
   * @memberof IBaseListViewEvents
   */
  onAfterInitComplete(): void;


  /**
   * This method is called when the view receives the data from the service.
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

/**
 * This component defines the base list view
 *
 * @export
 * @class BaseListView
 * @extends {BaseComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {IBaseView}
 * @template TModel
 */
@Component({
  template: '',
})
export class BaseListView<TModel> extends BaseComponent implements OnInit, OnDestroy, IBaseView {

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
  protected msgSubscription: any;

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
      dataServiceOptions.$filterClause = optionalData.$filterClause;
    }

    const injector =
      Injector.create({providers: [{provide: DataServiceToken, useValue:dataServiceOptions}], parent: AppInjector.getInjector()},);

    this.dataSvc = injector.get(GenericDataService);

    //console.log("form type " + this.formType);

    if (this.formType == FormType.List) {
      this.tableParams = new TableParams(this.routerSvc, this.appInitService);
    }else{
      throw new Error('Wrong View Form Type in View Definitions');
    }

    this.predefinedFilters = [];

    //work out whether we show Add New button or not
    this.showAddButton = false;
    if (this.metaData.allowAdd){
      const formView = this.config.views.filter(aView => aView.typeName == this.viewDef.typeName && aView.viewType == ViewType.Form);
      this.showAddButton = formView.length>0;
    }
  }

  canClose(): boolean {
    return true;
  }

  refresh(): void {
    this.loadServerData();
  }

  canOpen(key: any): boolean {
    return false;
  }

  ngOnInit(): void {
    InternalLogService.logger().debug(`BaseListView::ngOnInit`);

    //Message Bus related
    this.msgSubscription = {
      id: this.runTimeId,
      callback: this.handleMessage.bind(this)
    };
    this.messageSvc.subscribeToChannel(this.viewDef.typeName, this.msgSubscription);

    if (canCallAfterInitComplete(this)) {
      this.onAfterInitComplete();
    }

  }

  ngOnDestroy(): void {
    InternalLogService.logger().debug("BaseListView::ngOnDestroy");

    this.messageSvc.unSubscribeToChannel(this.viewDef.typeName, this.msgSubscription.id);

    if (this.tableParams) {
      this.tableParams.destroy();
    }
    if (this.dataSvc){
      this.dataSvc.ngOnDestroy();
      this.dataSvc = null;
    }
  }

  /**
   * Handle message from Message Bus to deal with other views updating related data
   *
   * @param {*} data
   * @memberof BaseListView
   */
  handleMessage(data:any){
    this.onRefreshData();
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

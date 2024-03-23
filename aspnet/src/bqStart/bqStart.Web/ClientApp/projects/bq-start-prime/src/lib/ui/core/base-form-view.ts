import { AfterContentInit, AfterViewInit, Component, ContentChildren, Inject, Injector, Input, OnDestroy, OnInit, Optional, QueryList, TemplateRef, ViewChild, ViewChildren, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWrapperService } from '../controls/view-wrapper/view-wrapper.service';
import { map } from 'rxjs/operators';
import { FormType, ViewData } from '../../config/bq-start-config';
import { IBaseEvents, MessageBusPayLoad, ModelMetadata, OperationType, PrimaryKey, ViewOptionalData } from '../../models/meta-data';
import { DataServiceOptions, DataServiceToken, GenericDataService } from '../../services/generic-data.service';
import { InternalLogService } from '../../services/log/log.service';
import { BaseComponent } from '../base.component';
import { BqForm } from '../controls/bq-form/bq-form';
import { RouterService } from '../../services/router.service';
import { IBaseView } from './base-view';
import { isEqual } from 'lodash-es';
import { KeyboardShortcutsSelectService, ShortcutEventOutput } from 'ng-keyboard-shortcuts';
import { Observable, Subscription } from 'rxjs';
import { AppInjector } from '../../services/app-injector.service';



/**
 * Defines the base abstract functionality of a BQ View (List/Form)
 * and their various event methods that you can override in the implemented class
 * @export
 * @interface IBaseFormViewEvents
 */
export declare interface IBaseFormViewEvents extends IBaseEvents {
  /**
   * This method is called when a view is done initializing it's internal details.
   * Typically you can other initialization functions here.
   * @memberof IBaseFormViewEvents
   */
  onAfterInitComplete(): void;

  /**
   * This method is called when the view receives the data from the service.
   * The service populates the 'models' property.
   * @memberof IBaseFormViewEvents
   */
  onAfterServerDataReceived(): void;
}

export declare interface IEditFormViewEvents{
  /**
     * This method is called when the data is about to be saved.
     * If returned true then save will continue else stop.
     * @memberof IBaseFormViewEvents
     */
  onBeforeSave(): boolean;

  /**
    * This method is called when the data is about to be deleted.
    * If returned true then delete operation will continue else stop.
    * @memberof IBaseFormViewEvents
    */
  onBeforeDelete(): boolean;
}

/**
 * Type Guard Functions for casting Interface Implementation Check runtime if
 * inherited classes has the events functions that can be called runtime
 */
function canCallAfterInitComplete(arg: Object): arg is IBaseFormViewEvents {
  return (arg as IBaseFormViewEvents).onAfterInitComplete !== undefined;
}

function canCallAfterServerDataReceived(
  arg: Object
): arg is IBaseFormViewEvents {
  return (arg as IBaseFormViewEvents).onAfterServerDataReceived !== undefined;
}

function canCallBeforeSave(
  arg: Object
): arg is IEditFormViewEvents {
  return (arg as IEditFormViewEvents).onBeforeSave !== undefined;
}

function canCallBeforeDelete(
  arg: Object
): arg is IEditFormViewEvents {
  return (arg as IEditFormViewEvents).onBeforeDelete !== undefined;
}

/**
 * This is the base class to implement a form view
 *
 * @export
 * @class BaseFormView
 * @extends {BaseComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {AfterViewInit}
 * @implements {AfterContentInit}
 * @implements {IBaseView}
 * @template TModel
 */
@Component({
  template: '',
})
export class BaseFormView<TModel>
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, IBaseView {
  metaData: ModelMetadata;
  viewDef: ViewData;
  formType: FormType;
  model: TModel = <TModel>{};
  lookupDataModel: any = <any>{};
  currentId: any[] = [];
  vwService: ViewWrapperService;

  allowNew: boolean;
  allowEdit: boolean;
  allowDetails: boolean;
  allowDelete: boolean;
  formViewId: string | undefined;
  autoLoadLookupData: boolean = true;
  keyboardSvc: KeyboardShortcutsSelectService;

  @ViewChild(BqForm) bqForm: BqForm;

  protected dataSvc: GenericDataService;
  protected msgSubscription: any;
  protected keyboardSubscription: Subscription;


  constructor(protected routerSvc: RouterService,
    @Inject('viewOptionalData') @Optional() private optionalData:ViewOptionalData) {
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
    this.vwService = inject(ViewWrapperService);
    this.keyboardSvc = inject(KeyboardShortcutsSelectService);

    if (this.keyboardSvc){
      this.keyboardSubscription = this.keyboardSvc.select("ctl + s").subscribe(
        {
          next:(e) => {
            console.log("check current view");
            this.save();
          }
        }
      )
    }

    if (this.formType == FormType.List) {
      throw new Error('Wrong View Form Type in View Defintions');
    }

    //work out the view links and details links
    const formViews = this.appInitService.runningConfig.formViewsByType[this.metaData.typeName] ?? [];
    this.formViewId = formViews.find(o => o)?.viewId;
    this.allowNew = (formViews.length > 0 && this.metaData.allowAdd);
    this.allowDetails = (formViews.length > 0 && this.metaData.allowSelect);
    this.allowEdit = (formViews.length > 0 && this.metaData.allowEdit);
    this.allowDelete = (formViews.length > 0 && this.metaData.allowDelete);

    if (this.vwService!=null){
      this.vwService.setupView(this);
    }
  }

  /**
   * Controls if a form can be closed in MDI view
   *
   * @return {*}  {boolean}
   * @memberof BaseFormView
   */
  canClose(): boolean {
    if (this.formType === FormType.Edit || this.formType === FormType.New){
      if (this.bqForm?.form.touched){
        return this.discard();
      }
    }
    return true;
  }

  /**
   * Refresh the form data
   *
   * @memberof BaseFormView
   */
  refresh(): void {
    if (this.formType == FormType.Details){
      this.loadServerData();
    }
  }

  /**
   * Controls whether a new instance of this form can be open in MDI view
   *
   * @param {*} key
   * @return {*}  {boolean}
   * @memberof BaseFormView
   */
  canOpen(key: any): boolean {
    if (key){
      if (isEqual(this.currentId, key)){
        return false;
      }
    }
      return true;

  }

  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.bqForm!=null){
      this.bqForm.parentForm = this;
    }
  }


  ngOnInit(): void {
    InternalLogService.logger().debug(`BaseFormView::ngOnInit`);

    this.routerSvc.primaryKeyValues.subscribe(primaryKeyValues => {

      this.currentId = primaryKeyValues;

      //we load lookup data first then chain loading server data
      if (this.autoLoadLookupData){
        this.loadLookupData();
      }else{
        this.prepareLoadServerData();
      }
    });

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

  prepareLoadServerData(){
    if (this.formType == FormType.Edit || this.formType == FormType.Details){
      this.loadServerData();
    }else{
      this.model = this.createEmptyModel();
    }
  }

  ngOnDestroy(): void {
    InternalLogService.logger().debug('BaseFormView::ngOnDestroy');
    this.messageSvc.unSubscribeToChannel(this.viewDef.typeName, this.msgSubscription.id);
    if (this.keyboardSubscription){
      this.keyboardSubscription.unsubscribe();
    }
  }

  private handleMessage(data:any){
    if (data.operationType == OperationType.Updated || data.operationType == OperationType.ServerUpdated){
      if (isEqual(this.currentId, data.key)){
        if (this.formType == FormType.Details){
          this.refresh();
        }else{
          console.log("TODO: show warning data as form data has been updated elsewhere");
        }
      }
    }
  }

  private loadServerData() {
    setTimeout(() => (this.isLoading = true), 0);
    this.dataSvc.get<TModel>(this.currentId, this.metaData).subscribe(data => {

      setTimeout(() => this.isLoading = false, 100);
      this.model = data.entity ?? <TModel>{};

      if (canCallAfterServerDataReceived(this)) {
        this.onAfterServerDataReceived();
      }

    }, this.errHandler.bind(this));
  }

  private loadLookupData(){
    setTimeout(() => (this.isLoading = true), 0);
    this.dataSvc.getLookupData(this.metaData).subscribe({
      next: (value) => {
        setTimeout(() => this.isLoading = false, 100);
        if (value!==null){
          if (value.entities !== null && value.entities.length > 0){
            this.lookupDataModel = value.entities;
          }else{
            this.lookupDataModel = value.entity;
          }
        }
        //now continue to load server data
        this.prepareLoadServerData();
      },
      error: this.errHandler.bind(this)
    });
  }

  /**
   * Get a new Empty Model for NEW form mode
   *
   * @return {*}  {TModel}
   * @memberof BaseFormView
   */
  createEmptyModel():TModel{
    return <TModel>{};
  }

  /**
   * Get the primary key of this entity
   *
   * @return {*}
   * @memberof BaseFormView
   */
  getKeyValue() {
    //console.log("get key value");
    if (this.model) {
      return this.metaData.getPrimaryKeyAsRouteParam(this.model);
    } else {
      return '';
    }
  }

  /**
   * Save the current record
   *
   * @return {*}
   * @memberof BaseFormView
   */
  save(){
    if (!this.bqForm.isValid)
      return;

    let canContinue: boolean = true;
    if (canCallBeforeSave(this)){
      canContinue = this.onBeforeSave();
    }

    if (canContinue){
      let isAdd = this.formType === FormType.New;
      this.dataSvc.save(this.model, isAdd).subscribe({
        next: (value) => {
          this.showSuccess(this.i18("bq-start.messages.recordSaved"));
          if (isAdd){
            if (value.entity != null){
              this.model = value.entity;
            }
            this.postMessage(OperationType.Added);
            this.gotoDetails();
          }else{
            this.postMessage(OperationType.Updated);
            this.navigationService.back(true);
          }
        },
        error: (value) => {
          if (value?.error?.error?.message){
            this.dialogService.errorDialog(value.error.error.message, this.i18("bq-start.messages.error"));
          }else{
            this.errHandler(value);
          }
        },
        complete:() => {}
      });
    }
  }

  /**
   * Delete the current Record
   *
   * @memberof BaseFormView
   */
  delete(){
    let canContinue: boolean = true;
    if (canCallBeforeDelete(this)){
      canContinue = this.onBeforeDelete();
    }

    if (canContinue){
      this.dialogService.confirm(this.i18("bq-start.messages.deleteConfirm"),this.i18("bq-start.messages.confirmation"), () => {
        this.dataSvc.delete(this.currentId, this.metaData).subscribe({
          next: (value)=>{
            this.showSuccess(this.i18("bq-start.messages.recordDeleted"));
            this.postMessage(OperationType.Deleted);
            this.navigationService.back();
          },
          error: (value)=>{
            if (value?.error?.error?.message){
              this.dialogService.errorDialog(value.error.error.message, this.i18("bq-start.messages.error"));
            }else{
              this.errHandler(value);
            }
          }
        });
      });
    }
  }

  /**
   * Undo or Discard the changes
   *
   * @return {*}  {boolean}
   * @memberof BaseFormView
   */
  discard():boolean{
    if (this.bqForm?.form.touched){
      this.dialogService.confirm(this.i18("bq-start.messages.discardConfirm"),this.i18("bq-start.messages.confirmation"), () => {
        this.navigationService.back(true);
      });
      return false;
    } else {
      this.navigationService.back(true);
      return true;
    }
  }

  /**
   * Go to the details view for this record
   *
   * @return {*}
   * @memberof BaseFormView
   */
  gotoDetails() {
    if (!this.allowDetails || !this.formViewId)
      return;
    if (this.appInitService.runningConfig.tabbedUserInterface) {
      this.navigationService.back(true);
    }else{
      this.routerSvc.navigateToView(this.formViewId, "form", this.getKeyValue(), { queryParamsHandling: 'merge' });
    }
  }

  private postMessage(operationType:OperationType){
    const payload = new MessageBusPayLoad();
    payload.operationType = operationType;
    payload.key = this.currentId;
    payload.typeName = this.viewDef.typeName;
    const msg = {
      payload: payload,
    };
    //console.log("posting message");
    //console.log(msg);
    this.messageSvc.postToChannel(this.viewDef.typeName, msg);
  }

}

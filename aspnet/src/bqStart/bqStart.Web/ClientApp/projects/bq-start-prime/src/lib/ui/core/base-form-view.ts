import { AfterContentInit, AfterViewInit, Component, ContentChildren, Inject, Injector, Input, OnDestroy, OnInit, Optional, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWrapperService } from '../controls/view-wrapper/view-wrapper.service';
import { map } from 'rxjs/operators';
import { FormType, ViewData } from '../../config/bq-start-config';
import { IBaseEvents, ModelMetadata, PrimaryKey, ViewOptionalData } from '../../models/meta-data';
import { DataServiceOptions, DataServiceToken, GenericDataService } from '../../services/generic-data.service';
import { InternalLogService } from '../../services/log/log.service';
import { BaseComponent } from '../base.component';
import { BqForm } from '../controls/bq-form/bq-form';
import { Message,MessageService } from 'primeng/api';



/**
 * Defines the base abstract functionality of a BQ View (List/Form)
 * and their various event methods that you can override in the implemented class
 * @export
 * @interface IBaseFormViewEvents
 */
export declare interface IBaseFormViewEvents extends IBaseEvents {
  /**
   * This method is called when a view is done initializing it's internal details.
   * Typically you can other initialiation functions here.
   * @memberof IBaseFormViewEvents
   */
  onAfterInitComplete(): void;

  /**
   * This method is called when the veiw receives the data from the service.
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

@Component({
  template: '',
})
export class BaseFormView<TModel>
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
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
  isDirty: boolean = false;
  autoLoadLookupData: boolean = true;

  @ViewChild(BqForm) bqForm: BqForm;

  protected dataSvc: GenericDataService;


  constructor(protected route: ActivatedRoute, protected router: Router,
    @Inject('viewOptionalData') @Optional() private optionalData:ViewOptionalData) {
    super();

    this.metaData = route.snapshot.data.metaData;
    this.viewDef = route.snapshot.data.viewDef;
    this.formType = route.snapshot.data.formType;

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
    this.vwService = this.injector.get(ViewWrapperService);

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

  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.bqForm!=null){
      this.bqForm.parentForm = this;
    }
  }


  ngOnInit(): void {
    InternalLogService.logger().debug(`BaseFormView::ngOnInit`);

    this.route.paramMap.pipe(
      map(param => {
        InternalLogService.logger().debug("params", param);
        if (param.has('keys')){
          return this.metaData.parseRouteParamToKeys(param.get('keys'));
        }else{
          return [];
        }
      })
    ).subscribe(primaryKeyValues => {
      this.currentId = primaryKeyValues;

      if (this.autoLoadLookupData){
        this.loadLookupData();
      }

      if (this.formType == FormType.Edit || this.formType == FormType.Details){
        this.loadServerData();
      }else{
        this.model = this.createEmptyModel();
      }
    });

    if (canCallAfterInitComplete(this)) {
      this.onAfterInitComplete();
    }
  }

  ngOnDestroy(): void {
    InternalLogService.logger().debug('BaseFormView::ngOnDestroy');
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
    this.dataSvc.getLookupData(this.metaData).subscribe({
      next: (value) => {
        if (value!==null){
          if (value.entities !== null && value.entities.length > 0){
            this.lookupDataModel = value.entities;
          }else{
            this.lookupDataModel = value.entity;
          }
        }
      },
      error: this.errHandler.bind(this)
    });
  }
  createEmptyModel():TModel{
    return <TModel>{};
  }

  getKeyValue() {
    //console.log("get key value");
    if (this.model) {
      return this.metaData.getPrimaryKeyAsRouteParam(this.model);
    } else {
      return '';
    }
  }

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
            this.gotoDetails();
          }else{
            this.navigationService.back();
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

  discard(){
    if (this.isDirty){
      this.dialogService.confirm(this.i18("bq-start.messages.discardConfirm"),this.i18("bq-start.messages.confirmation"), () => {
        this.navigationService.back();
      });
    } else {
      this.navigationService.back();
    }
  }

  gotoDetails() {
    if (!this.allowDetails || !this.formViewId)
      return;

    const path = `view/${this.formViewId}/form/${this.getKeyValue()}`;
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }


}

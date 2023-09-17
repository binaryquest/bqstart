import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, Host, Input, OnInit, Optional, Output, QueryList, TemplateRef } from '@angular/core';
import { BaseFormView } from '../core/base-form-view';

import { MetadataField } from '../../models/meta-data';
import { FormBlock } from '../controls/form-block/form-block';
import { ViewWrapperService } from '../controls/view-wrapper/view-wrapper.service';
import { ControlContainer, ControlValueAccessor, NgForm } from '@angular/forms';
import { BQTemplate } from './bq-template.directive';
import { Dictionary } from '../../models/meta-data';
import { FormType } from '../../config/bq-start-config';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

/**
 * Defines a base functionality for a form field
 *
 * @export
 * @abstract
 * @class BaseField
 * @implements {OnInit}
 * @implements {AfterContentInit}
 */
@Component({
  selector: 'bq-form > base-field',
  template: ''
})

export abstract class BaseField implements OnInit, AfterContentInit {

  /**
   * the column block size for the display label for this field
   *
   * @type {number}
   * @memberof BaseField
   */
  @Input()
  labelSize: number;

  /**
   * the field block size in column
   *
   * @type {number}
   * @memberof BaseField
   */
  @Input()
  fieldSize: number = 0;

  /**
   * The meta data field to get the details from
   *
   * @type {MetadataField}
   * @memberof BaseField
   */
  @Input()
  field?: MetadataField;

  /**
   * Caption to display. If Metadata field is set then caption will be used from that.
   *
   * @type {(string | null | undefined)}
   * @memberof BaseField
   */
  @Input()
  caption: string | null | undefined;

  /**
   * id of the field
   *
   * @type {string}
   * @memberof BaseField
   */
  @Input()
  id: string;

  /**
   * name of the field to be used when inside a form
   *
   * @type {string}
   * @memberof BaseField
   */
  @Input()
  name: string;

  /**
   * if true then in edit more it will still display value instead of showing the input field
   *
   * @type {boolean}
   * @memberof BaseField
   */
  @Input()
  readonly: boolean = false;

  /**
   * the model binding property
   *
   * @readonly
   * @type {*}
   * @memberof BaseField
   */
  @Input()
  get model(): any {
    return this._model;
  }
  set model(value:any) {
    this._model = value;
    if (this.field?.dataType === "DateTime" && value !== null && value !== undefined){
      this.dateModel = new Date(value);
    }else{
      this.dateModel = null;
    }
    this.model$.next(value);
  }

  /**
   * show the input field but in readonly form. Similar to @member readonly but renders the input fields
   *
   * @type {boolean}
   * @memberof BaseField
   */
  @Input()
  disabled: boolean = false;

  //models internal observable
  readonly model$ = new ReplaySubject<any>();
  //backing model store
  _model: any;
  dateModel: Date|null;

  /**
   * when the model value changes this will be fired
   *
   * @memberof BaseField
   */
  @Output()
  modelChange = new EventEmitter<any>();

  @ContentChildren(BQTemplate) templates: QueryList<BQTemplate>;
  controlRenderTemplate: TemplateRef<any>;
  optionalDisplayTemplate: TemplateRef<any> | null | undefined;
  optionalEditTemplate: TemplateRef<any> | null | undefined;
  optionalTemplates: Dictionary<TemplateRef<any>>;

  mainCss: string;
  fieldCss: string;
  labelCss: string;
  editMode: boolean;
  parent: BaseFormView<any> | null;

  /**
   * if the value is required in edit mode
   *
   * @type {boolean}
   * @memberof BaseField
   */
  @Input()
  isRequired: boolean = false;

  innerDivVAlign: string = "";

  constructor(protected vwSvc: ViewWrapperService, protected formBlock?: FormBlock) {
    if (vwSvc.currentView!=null){
      this.parent = vwSvc.currentView;
      this.editMode = (vwSvc.currentView?.formType === FormType.Edit || vwSvc.currentView?.formType === FormType.New);
    }
    this.optionalTemplates = {};
  }

  // change events from the textarea
  onChange(newVal:any) {
    // update the form
    this.modelChange.next(newVal);
  }

  ngOnInit(): void {
    if (this.formBlock){
      if (this.labelSize === undefined || this.labelSize <= 0){
        this.labelSize = this.formBlock.labelSize;
      }
    }
    this.labelCss = `col-12 md:col-${this.labelSize} flex justify-content-between`;
    let fieldSizeFinal = (this.fieldSize > 0 ? this.fieldSize : (12 - this.labelSize));
    this.fieldCss = `col-12 md:col-${fieldSizeFinal}`;
    this.mainCss = `field grid`;
    if (this.caption === null || this.caption === undefined){
      this.caption = this.field?.caption;
    }
    if (this.id === null || this.id === undefined){
      this.id = <string>this.field?.name;
    }
    //if not already set by user in the form
    if (!this.isRequired){
      this.isRequired = !(this.field?.isNullable) && !(this.field?.autoGen);
    }
    if (this.editMode){
      this.innerDivVAlign = "center"
    }
  }

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "display":
          this.optionalDisplayTemplate = item.template;
          break;
        case "editor":
          this.optionalEditTemplate = item.template;
          break;
        default:
          this.optionalTemplates[item.getType()] = item.template;
          break;
      }
    });
    this.initializeRender();
  }

  public abstract initializeRender():void;

}


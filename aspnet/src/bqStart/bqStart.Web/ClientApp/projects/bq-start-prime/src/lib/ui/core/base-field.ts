import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, Host, Input, OnInit, Optional, Output, QueryList, TemplateRef } from '@angular/core';
import { BaseFormView } from '../core/base-form-view';
import { FormType } from 'projects/bq-start-prime/src/public-api';
import { MetadataField } from '../../models/meta-data';
import { FormBlock } from '../controls/form-block/form-block';
import { ViewWrapperService } from '../controls/view-wrapper/view-wrapper.service';
import { ControlContainer, ControlValueAccessor, NgForm } from '@angular/forms';
import { BQTemplate } from './bq-template.directive';
import { Dictionary } from '../../models/meta-data';
@Component({
  selector: 'bq-form > base-field',
  template: ''
})

export abstract class BaseField implements OnInit, AfterContentInit {

  @Input()
  labelSize: number = 3;

  @Input()
  fieldSize: number = 0;

  @Input()
  field?: MetadataField;

  @Input()
  caption: string | null | undefined;

  @Input()
  id: string;

  @Input()
  name: string;

  @Input()
  model: any;

  @Input()
  disabled: boolean = false;

  // Output prop name must be Input prop name + 'Change'
  // Use in your component to write an updated value back out to the parent
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
      if (this.labelSize <= 0){
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
    this.isRequired = !(this.field?.isNullable) && !(this.field?.autoGen);
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


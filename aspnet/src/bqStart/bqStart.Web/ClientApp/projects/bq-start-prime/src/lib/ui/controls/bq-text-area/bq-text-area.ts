import { Component, Host, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ValidationType } from '../../../models/meta-data';
import { BaseField } from '../../core/base-field';
import { FormBlock } from '../form-block/form-block';
import { ViewWrapperService } from '../view-wrapper/view-wrapper.service';

@Component({
  selector: 'bq-text-area',
  templateUrl: './bq-text-area.html',
  styleUrls: ['./bq-text-area.scss']
})
export class BqTextArea extends BaseField {

  @ViewChild("defaultRender",{static: true}) defaultRender: TemplateRef<any>;
  @ViewChild("stringRender",{static: true}) stringRender: TemplateRef<any>;

  @Input()
  minLength: number;

  @Input()
  maxLength: number;

  @Input()
  row: number = 5;


  @Input()
  autoResize: boolean;

  constructor(protected override vwSvc: ViewWrapperService, @Optional() @Host() protected override formBlock?: FormBlock) {
    super(vwSvc, formBlock);
  }

  public initializeRender(): void {
    if (this.editMode){
      if (this.optionalEditTemplate !== undefined && this.optionalEditTemplate != null){
        this.controlRenderTemplate = this.optionalEditTemplate;
      }else{
        //these are used to determine what type of control to display in client side
        this.setupEditModeRendering();
      }
    }else{ //not in edit mode, just display it
      if (this.optionalDisplayTemplate !== undefined && this.optionalDisplayTemplate !== null){
        this.controlRenderTemplate = this.optionalDisplayTemplate;
      }else{
        //these are used to determine what type of control to display in client side
        this.setupDisplayModeRendering();
      }
    }
  }

  private setupDisplayModeRendering() {
    switch (this.field?.dataType) {
      case 'Boolean':
      case 'Decimal':
      case 'Double':
      case 'Single':
      case 'Int32':
      case 'Int64':
      case 'UInt32':
      case 'UInt64':
      case 'Char':
      case 'Guid':
      case 'DateTime':
      case 'String':
      default:
        this.controlRenderTemplate = this.defaultRender;
        break;
    }
  }

  private setupEditModeRendering() {
    switch (this.field?.dataType) {
      case 'Boolean':
      case 'Decimal':
      case 'Double':
      case 'Single':
      case 'Int32':
      case 'Int64':
      case 'UInt32':
      case 'UInt64':
      case 'Char':
      case 'Guid':
      case 'DateTime':
      case 'String':
        this.controlRenderTemplate = this.stringRender;
        let maxVal = this.field?.validations.filter(f => f.validationType == ValidationType.maxLength);
        if (maxVal.length > 0) {
          if (this.maxLength === undefined && maxVal[0].maxLength !== undefined) {
            this.maxLength = maxVal[0].maxLength;
          }
          if (this.minLength === undefined && maxVal[0].minLength !== undefined) {
            this.minLength = maxVal[0].minLength;
          }
        }
        let minVal = this.field?.validations.filter(f => f.validationType == ValidationType.minLength);
        if (minVal.length > 0) {
          if (this.minLength === undefined && minVal[0].minLength !== undefined) {
            this.minLength = minVal[0].minLength;
          }
        }
        break;
      default:
        this.controlRenderTemplate = this.defaultRender;
        break;
    }
  }
}

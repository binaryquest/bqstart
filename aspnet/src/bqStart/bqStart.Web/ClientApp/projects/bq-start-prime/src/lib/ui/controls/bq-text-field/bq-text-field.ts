import { Component, ContentChildren, forwardRef, Host, Input, OnInit, Optional, QueryList, SkipSelf, TemplateRef, ViewChild } from '@angular/core';
import { ViewWrapperService } from '../view-wrapper/view-wrapper.service';
import { BaseField } from '../../core/base-field';
import { FormBlock } from '../form-block/form-block';
import { ValidationType } from 'bq-start-core';


/**
 * Display a text-field. This component will know how to render information based on metadata and apply validation as needed.
 *
 * @export
 * @class BqTextField
 * @extends {BaseField}
 */
@Component({
  selector: 'bq-text-field',
  templateUrl: './bq-text-field.html',
  styleUrls: ['./bq-text-field.scss']
})
export class BqTextField extends BaseField {

  @ViewChild("defaultRender",{static: true}) defaultRender: TemplateRef<any>;
  @ViewChild("stringRender",{static: true}) stringRender: TemplateRef<any>;
  @ViewChild("numberRender",{static: true}) numberRender: TemplateRef<any>;
  @ViewChild("dateRender",{static: true}) dateRender: TemplateRef<any>;
  @ViewChild("integerRender",{static: true}) integerRender: TemplateRef<any>;
  @ViewChild("emailRender",{static: true}) emailRender: TemplateRef<any>;
  @ViewChild("boolRender",{static: true}) boolRender: TemplateRef<any>;
  @ViewChild("booleanDisplayRender",{static: true}) booleanDisplayRender: TemplateRef<any>;
  @ViewChild("defaultDateRender",{static: true}) defaultDateRender: TemplateRef<any>;

  /**
   * If field type is datetime then what format to display.
   *
   * @type {(string | undefined | null)}
   * @memberof BqTextField
   */
  @Input()
  dateFormat: string | undefined | null;

  /**
   * Also show time part if datetime
   *
   * @type {boolean}
   * @memberof BqTextField
   */
  @Input()
  showTime: boolean = false;

  /**
   * Min value to accept if number type
   *
   * @type {number}
   * @memberof BqTextField
   */
  @Input()
  min: number;

  /**
   * Max value to accept if number type
   *
   * @type {number}
   * @memberof BqTextField
   */
  @Input()
  max: number;

  /**
   * Min length of strings allowed
   *
   * @type {number}
   * @memberof BqTextField
   */
  @Input()
  minLength: number;

  /**
   * Max length of strings allowed
   *
   * @type {number}
   * @memberof BqTextField
   */
  @Input()
  maxLength: number;

  /**
   * If number/currency type, what digit seperator to show
   *
   * @type {boolean}
   * @memberof BqTextField
   */
  @Input()
  seperateDigits: boolean = false;

  /**
   * if Currency format type
   *
   * @memberof BqTextField
   */
  @Input()
  set currency(value:boolean){
    this._currency = value;
    if (value){
      this.numberMode = "currency";
      this.seperateDigits = true;
    }
  }
  get currency():boolean{
    return  this._currency;
  }

  /**
   * Currency Code to display
   *
   * @type {string}
   * @memberof BqTextField
   */
  @Input()
  currencyCode: string = "USD";

  private _currency: boolean;

  minLengthInner: any;
  maxLengthInner: any;
  numberMode: any = "decimal";

  /**
   * Apply Regex validation
   *
   * @type {*}
   * @memberof BqTextField
   */
  @Input()
  regexPattern: any;

  /**
   * Error message to show if regex fails
   *
   * @type {*}
   * @memberof BqTextField
   */
  @Input()
  regexMessage: any;

  localeFormat: string;
  localePipeFormat: string;

  /**
   * If comapare value againts another field. Useful for password RE-TYPE.
   *
   * @type {*}
   * @memberof BqTextField
   */
  @Input()
  compareTo: any;

  /**
   * Compare to control
   *
   * @type {*}
   * @memberof BqTextField
   */
  @Input()
  compareParent: any;

  /**
   * Message to show if comparison fails
   *
   * @type {*}
   * @memberof BqTextField
   */
  @Input()
  compareToMsg: any;

  constructor(protected override vwSvc: ViewWrapperService, @Optional() @Host() protected override formBlock?: FormBlock) {
    super(vwSvc, formBlock);

    this.localeFormat = "dd-mm-yy";//moment.localeData().longDateFormat('L').toLowerCase().replace('yyyy', 'yy');
    this.localePipeFormat = 'shortDate';
  }


  public initializeRender(): void {



    if (this.dateFormat !== undefined && this.dateFormat !== null){
      this.localeFormat = this.dateFormat;
    }

    if (this.showTime){
      this.localePipeFormat = 'short';
    }
    //console.log("localformat %s", this.localeFormat);

    if (this.editMode===true && this.readonly===false){
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
        this.controlRenderTemplate = this.booleanDisplayRender;
        break;
      case 'DateTime':
        this.controlRenderTemplate = this.defaultDateRender;
        break;
      case 'Decimal':
      case 'Double':
      case 'Single':
      case 'Int32':
      case 'Int64':
      case 'UInt32':
      case 'UInt64':
      case 'Char':
      case 'Guid':
      case 'String':
      default:
        this.controlRenderTemplate = this.defaultRender;
        break;
    }
  }

  private setupEditModeRendering() {
    switch (this.field?.dataType) {
      case 'Boolean':
        this.controlRenderTemplate = this.boolRender;
        break;
      case 'Decimal':
      case 'Double':
      case 'Single':
        this.controlRenderTemplate = this.numberRender;
        this.rangeValidationSetup();
        break;
      case 'Int32':
      case 'Int64':
        this.controlRenderTemplate = this.integerRender;
        this.rangeValidationSetup();
        break;
      case 'UInt32':
      case 'UInt64':
        this.controlRenderTemplate = this.integerRender;
        this.rangeValidationSetup();
        break;
      case 'Char':
        this.controlRenderTemplate = this.stringRender;
        this.minLength = 1;
        this.maxLength = 1;
        break;
      case 'Guid':
        this.controlRenderTemplate = this.stringRender;
        break;
      case 'DateTime':
        this.controlRenderTemplate = this.dateRender;
        break;
      case 'String':
        this.controlRenderTemplate = this.stringRender;
        if (this.field?.hasEmailValidator()) {
          this.controlRenderTemplate = this.emailRender;
        }
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
        let regVal = this.field?.validations.filter(f => f.validationType == ValidationType.regularExpression);
        if (regVal !== undefined && regVal.length > 0 && this.regexPattern !== undefined) {
          this.regexPattern = regVal[0].pattern;
        }
        let comVal = this.field?.validations.filter(f => f.validationType == ValidationType.compare);
        if (comVal !== undefined && comVal.length > 0 && this.compareTo !== undefined && comVal[0].otherProperty !== undefined) {
          this.compareTo = comVal[0].otherProperty;
        }
        break;
      default:
        this.controlRenderTemplate = this.defaultRender;
        break;
    }
  }

  private rangeValidationSetup() {
    let rangeVal = this.field?.validations.filter(f => f.validationType == ValidationType.range);
    if (rangeVal!==undefined && rangeVal.length > 0) {
      const val = rangeVal[0];
      if (this.min === undefined && val.minRange !== undefined) {
        this.min = val.minRange;
      }
      if (this.max === undefined && val.maxRange !== undefined) {
        this.max = val.maxRange;
      }
    }
  }
}

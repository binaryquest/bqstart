import { Component, Host, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ValidationType } from 'bq-start-core';
import { BaseField } from '../../core/base-field';
import { FormBlock } from '../form-block/form-block';
import { ViewWrapperService } from '../view-wrapper/view-wrapper.service';

/**
 * Show a password field either in edit or display mode depending on the current form view.
 *
 * @export
 * @class BqPasswordField
 * @extends {BaseField}
 */
@Component({
  selector: 'bq-password-field',
  templateUrl: './bq-password-field.html',
  styleUrls: ['./bq-password-field.scss']
})
export class BqPasswordField extends BaseField {

  @ViewChild("passwordRender",{static: true}) passwordRender: TemplateRef<any>;
  @ViewChild("displayPasswordRender",{static: true}) displayPasswordRender: TemplateRef<any>;

  /**
   * Minimum length to accept for a password
   *
   * @type {number}
   * @memberof BqPasswordField
   */
  @Input()
  minLength: number;

  /**
   * Maximum length to accept for a password
   *
   * @type {number}
   * @memberof BqPasswordField
   */
  @Input()
  maxLength: number;

  minLengthInner: any;
  maxLengthInner: any;

  /**
   * A regex pattern for validation of the password
   *
   * @type {*}
   * @memberof BqPasswordField
   */
  @Input()
  regexPattern: any;

  /**
   * If regex fails, the message to display
   *
   * @type {*}
   * @memberof BqPasswordField
   */
  @Input()
  regexMessage: any;

  /**
   * Compare to value from another control/field
   *
   * @type {*}
   * @memberof BqPasswordField
   */
  @Input()
  compareTo: any;

  /**
   * UI Control to compare from
   *
   * @type {*}
   * @memberof BqPasswordField
   */
  @Input()
  compareParent: any;

  /**
   * if comapare fails, what message to display
   *
   * @type {*}
   * @memberof BqPasswordField
   */
  @Input()
  compareToMsg: any;

  constructor(protected override vwSvc: ViewWrapperService, @Optional() @Host() protected override formBlock?: FormBlock) {
    super(vwSvc, formBlock);
    //this.localeFormat = moment.localeData().longDateFormat('L').toLowerCase().replace('yyyy', 'yy');
  }

  public initializeRender(): void {
    if (this.editMode){
      this.controlRenderTemplate = this.passwordRender;
      let maxVal = this.field?.validations.filter(f => f.validationType == ValidationType.maxLength);
        if (maxVal!==undefined && maxVal.length > 0) {
          if (this.maxLength === undefined && maxVal[0].maxLength !== undefined) {
            this.maxLength = maxVal[0].maxLength;
          }
          if (this.minLength === undefined && maxVal[0].minLength !== undefined) {
            this.minLength = maxVal[0].minLength;
          }
        }
        let minVal = this.field?.validations.filter(f => f.validationType == ValidationType.minLength);
        if (minVal!==undefined && minVal.length > 0) {
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
    }else{ //not in edit mode, just display it
      this.controlRenderTemplate = this.displayPasswordRender;
    }
  }
}

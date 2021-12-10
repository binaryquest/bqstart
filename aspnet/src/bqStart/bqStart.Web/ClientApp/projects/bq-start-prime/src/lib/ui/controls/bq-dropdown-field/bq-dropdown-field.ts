import {
  Component,
  Host,
  Input,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { isArray } from 'lodash';
import { map, Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { EnumItem } from '../../../models/meta-data';
import { BaseField } from '../../core/base-field';
import { FormBlock } from '../form-block/form-block';
import { ViewWrapperService } from '../view-wrapper/view-wrapper.service';
import { intersectionWith } from 'lodash-es';

@Component({
  selector: 'bq-dropdown-field',
  templateUrl: './bq-dropdown-field.html',
  styleUrls: ['./bq-dropdown-field.scss'],
})
export class BqDropdownField extends BaseField {

  @ViewChild('defaultRender', { static: true }) defaultRender: TemplateRef<any>;
  @ViewChild('editRender', { static: true }) editRender: TemplateRef<any>;
  @ViewChild('editEnumRender', { static: true })
  editEnumRender: TemplateRef<any>;
  controlItemRenderTemplate: TemplateRef<any>;
  controlItemLabelRenderTemplate: TemplateRef<any>;
  @ViewChild('defaultItemRender', { static: true }) defaultItemRender: TemplateRef<any>;

  @Input()
  showAsEnum: boolean | undefined;
  itemEnumSource: EnumItem[] | null;

  @Input()
  itemSource: any[];
  @Input()
  displayName: string;
  @Input()
  valueName: string;
  @Input()
  editable: boolean;
  @Input()
  groupBy: string;
  @Input()
  addIfNotInList: boolean;
  @Input()
  allowMultiple: boolean;

  displayModel$:Observable<any>|null = null;

  constructor(
    protected vwSvc: ViewWrapperService,
    @Optional() @Host() protected formBlock?: FormBlock
  ) {
    super(vwSvc, formBlock);
  }

  public initializeRender(): void {
    if (this.showAsEnum && this.field?.enums) {
      this.itemEnumSource = this.field?.enums;
    }

    if (this.editMode) {
      if (this.showAsEnum && this.field?.enums) {
        this.controlRenderTemplate = this.editEnumRender;
      } else {
        this.controlRenderTemplate = this.editRender;
        if (this.optionalTemplates["item"] !== null && this.optionalTemplates["item"] !== undefined){
          this.controlItemRenderTemplate = this.optionalTemplates["item"];
        }
        if (this.optionalTemplates["label"] !== null && this.optionalTemplates["item"] !== undefined){
          this.controlItemLabelRenderTemplate = this.optionalTemplates["label"];
        }
      }
    } else {
      if (this.optionalTemplates["displayLabel"] !== null && this.optionalTemplates["displayLabel"] !== undefined){
        this.controlRenderTemplate = this.optionalTemplates["displayLabel"];
      }else{
        this.controlRenderTemplate = this.defaultRender;
      }
    }

    this.displayModel$ = this.model$.pipe(map((value,index) => {
      if (value!=null){
        if(this.showAsEnum){
          if (this.itemEnumSource!=null){
            const dp = this.itemEnumSource.filter((v) => v.id === value);
            return dp.length>0 ? dp[0].name : "";
          }
        }else{
          if (this.itemSource!=null){
            console.log("check drop value");
            const propName = this.valueName !== undefined ? this.valueName : this.displayName;
            if (isArray(value)){
              var result = intersectionWith(this.itemSource, value, (arrVal, othVal) => arrVal[propName] === othVal[propName]);
              return result.map(m => m[propName]).join(", ");
            }else{
              const dp = this.itemSource.filter((v) => v[propName] === value);
              return dp.length>0 ? dp[0][this.displayName] : "";
            }
          }
        }
      }
      return "-";
    }));


  }
}

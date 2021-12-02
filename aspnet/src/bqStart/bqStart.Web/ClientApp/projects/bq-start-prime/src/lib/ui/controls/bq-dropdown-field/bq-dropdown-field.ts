import {
  Component,
  Host,
  Input,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { EnumItem } from '../../../models/meta-data';
import { BaseField } from '../../core/base-field';
import { FormBlock } from '../form-block/form-block';
import { ViewWrapperService } from '../view-wrapper/view-wrapper.service';

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
        if (this.optionalTemplates["item"] !== null){
          this.controlItemRenderTemplate = this.optionalTemplates["item"];
        }
        if (this.optionalTemplates["label"] !== null){
          this.controlItemLabelRenderTemplate = this.optionalTemplates["label"];
        }
      }
    } else {
      this.controlRenderTemplate = this.defaultRender;
    }
  }
}

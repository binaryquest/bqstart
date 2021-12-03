import { AfterContentInit, AfterViewInit, Component, ContentChildren, Host, Inject, Input, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ViewWrapperService } from '../view-wrapper/view-wrapper.service';

import { BaseFormView } from '../../core/base-form-view';
import { BQTemplate } from '../../core/bq-template.directive';
import { Router } from '@angular/router';
import { FormType } from '../../../config/bq-start-config';

@Component({
  selector: 'bq-form',
  templateUrl: './bq-form.html',
  styleUrls: ['./bq-form.scss'],
  providers: [
    {
      provide: ControlContainer,
      useFactory: (comp:any) => <any>comp.form,
      deps: [BqForm]
    }
  ],
})
export class BqForm implements AfterContentInit {

  @ViewChild(NgForm, { static: false }) form: NgForm;

  showNew: boolean = false;
  showEdit: boolean = false;
  showDelete: boolean = false;
  editMode: boolean = false;

  additionalActions: TemplateRef<any>;
  additionalActionsOnRight: TemplateRef<any>;

  @ContentChildren(BQTemplate) templates: QueryList<BQTemplate>;
  parentForm: BaseFormView<any>;

  constructor(protected router: Router, protected vwService: ViewWrapperService, ) {
    if (vwService.currentView != null){
      this.parentForm = vwService.currentView;
      this.editMode = this.parentForm.formType == FormType.Edit || this.parentForm.formType === FormType.New;
      this.showNew = this.parentForm.allowNew && !this.editMode;
      this.showEdit = this.parentForm.allowEdit && !this.editMode;
      this.showDelete = this.parentForm.allowDelete && !this.editMode;
    }
  }

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "additionalActions":
          this.additionalActions = item.template;
          break;
        case "additionalActionsOnRight":
          this.additionalActionsOnRight = item.template;
          break;
      }
    });
  }

  create(){
    if (!this.showNew)
      return;
    const path = `view/${this.parentForm?.formViewId}/add/-1`;
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  edit(){
    if (!this.showEdit)
      return;
    const path = `view/${this.parentForm?.formViewId}/edit/${this.parentForm?.getKeyValue()}`;
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  delete(){
    this.parentForm?.delete();
  }

  save(){
    this.parentForm?.save();
  }

  discard(){
    this.parentForm?.discard();
  }

  onSubmit(){
    this.parentForm?.save();
  }

  get isValid(){
    return this.form.form.valid;
  }
}

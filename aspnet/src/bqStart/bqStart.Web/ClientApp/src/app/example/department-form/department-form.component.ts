import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewOptionalData } from 'bq-start-core';
import { IBaseFormViewEvents } from 'bq-start-prime';
import { BaseFormView, IEditFormViewEvents, RouterService } from 'bq-start-prime';
import { Address, Department } from '../../models/department';

const OPTIONAL_DATA:ViewOptionalData = {
  //$filterClause: "contains(DepartmentName,'dd')",
  $expandClause: "AddressNavigation"
};
@Component({
    selector: 'app-department-form',
    templateUrl: './department-form.component.html',
    styleUrls: ['./department-form.component.scss'],
    standalone: false
})
export class DepartmentFormComponent extends BaseFormView<Department> implements IBaseFormViewEvents, IEditFormViewEvents {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, OPTIONAL_DATA);
  }

  onBeforeSave(): boolean {
   return true;
  }
  onBeforeDelete(): boolean {
    return true;
  }

  onAfterInitComplete(): void {

  }
  onAfterServerDataReceived(): void {
    if (!this.model.AddressNavigation){
      this.model.AddressNavigation = new Address();
    }
  }

}

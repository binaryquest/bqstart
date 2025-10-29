import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewOptionalData } from 'bq-start-core';
import { BaseListView, RouterService } from 'bq-start-prime';
import { Department } from '../../models/department';

const OPTIONAL_DATA:ViewOptionalData = {
  //$filterClause: "contains(DepartmentName,'dd')",
  //$expandClause: "AddressNavigation"
};

@Component({
    selector: 'app-department-list',
    templateUrl: './department-list.component.html',
    styleUrls: ['./department-list.component.scss'],
    standalone: false
})
export class DepartmentListComponent extends BaseListView<Department> {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, OPTIONAL_DATA);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListView, RouterService, ViewOptionalData } from 'projects/bq-start-prime/src/public-api';
import { Department } from 'src/app/models/department';

const OPTIONAL_DATA:ViewOptionalData = {
  //$filterClause: "contains(DepartmentName,'dd')",
  //$expandClause: "AddressNavigation"
};

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent extends BaseListView<Department> {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, OPTIONAL_DATA);
  }

}

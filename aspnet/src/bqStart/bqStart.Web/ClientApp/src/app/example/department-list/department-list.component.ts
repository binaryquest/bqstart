import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListView, RouterService } from 'projects/bq-start-prime/src/public-api';
import { Department } from 'src/app/models/department';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent extends BaseListView<Department> {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, {});
  }

}

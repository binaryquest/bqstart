import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormView, RouterService } from 'projects/bq-start-prime/src/public-api';
import { Department } from 'src/app/models/department';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent extends BaseFormView<Department> {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, {});
  }

}

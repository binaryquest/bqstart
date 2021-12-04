import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListView, ViewOptionalData } from 'projects/bq-start-prime/src/public-api';
import { ExampleClass } from 'src/app/models/exampleClass';

const OPTIONAL_DATA:ViewOptionalData = {
  $expandClause: "Department"
};

@Component({
  selector: 'app-example-list',
  templateUrl: './example-list.component.html',
  styleUrls: ['./example-list.component.scss']
})
export class ExampleListComponent  extends BaseListView<ExampleClass> {

  constructor(protected route: ActivatedRoute, protected router:Router) {
    super(route, router, OPTIONAL_DATA);
  }

}

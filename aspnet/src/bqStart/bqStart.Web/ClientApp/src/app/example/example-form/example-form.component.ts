import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormView, ViewOptionalData } from 'projects/bq-start-prime/src/public-api';
import { ExampleClass } from 'src/app/models/exampleClass';


const OPTIONAL_DATA:ViewOptionalData = {
  $expandClause: "Department"
};

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.scss']
})
export class ExampleFormComponent extends BaseFormView<ExampleClass> {

  constructor(protected route: ActivatedRoute, protected router:Router) {
    super(route, router, OPTIONAL_DATA);
  }

}

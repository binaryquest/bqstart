import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormView, IBaseFormViewEvents, ViewOptionalData, RouterService } from 'projects/bq-start-prime/src/public-api';
import { ExampleClass } from 'src/app/models/exampleClass';


const OPTIONAL_DATA:ViewOptionalData = {
  $expandClause: "Department"
};

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.scss']
})
export class ExampleFormComponent extends BaseFormView<ExampleClass> implements IBaseFormViewEvents {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, OPTIONAL_DATA);
  }

  onAfterInitComplete(): void {

  }

  onAfterServerDataReceived(): void {

  }
}

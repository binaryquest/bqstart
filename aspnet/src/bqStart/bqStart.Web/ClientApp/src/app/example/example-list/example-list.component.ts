import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseListView, ViewOptionalData, RouterService, PREDICATE_EQUALS, PredefinedFilter, IBaseListViewEvents, RowExpandedEventData } from 'projects/bq-start-prime/src/public-api';
import { ExampleClass, ExampleClassType } from 'src/app/models/exampleClass';

const OPTIONAL_DATA:ViewOptionalData = {
  $expandClause: "Department"
};

@Component({
  selector: 'app-example-list',
  templateUrl: './example-list.component.html',
  styleUrls: ['./example-list.component.scss']
})
export class ExampleListComponent  extends BaseListView<ExampleClass> implements IBaseListViewEvents {

  constructor(protected override routerSvc: RouterService) {
    super(routerSvc, OPTIONAL_DATA);

    this.predefinedFilters = [
      new PredefinedFilter({field: this.metaData.fields.ClassType, filterName: 'Regular Class', predicate: PREDICATE_EQUALS.key, value: "RegularClass"}),
      new PredefinedFilter({field: this.metaData.fields.ClassType, filterName: 'Prospective Class', predicate: PREDICATE_EQUALS.key, value: "NewClass"}),
    ];
  }
  onAfterInitComplete(): void {

  }
  onAfterServerDataReceived(): void {

  }

  onExpanded(ev:RowExpandedEventData){
    console.log(ev);
  }

}

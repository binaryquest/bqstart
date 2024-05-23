import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ODataResponse } from 'bq-start-prime';
import { BaseListView, ViewOptionalData, RouterService, PREDICATE_EQUALS, PredefinedFilter, IBaseListViewEvents, RowExpandedEventData } from 'projects/bq-start-prime/src/public-api';
import { map } from 'rxjs';
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

  departmentList:any[] = [];

  constructor(protected override routerSvc: RouterService, private http:HttpClient) {
    super(routerSvc, OPTIONAL_DATA);

    this.predefinedFilters = [
      new PredefinedFilter({field: this.metaData.fields.ClassType, filterName: 'Regular Class', predicate: PREDICATE_EQUALS.key, value: "RegularClass"}),
      new PredefinedFilter({field: this.metaData.fields.ClassType, filterName: 'Prospective Class', predicate: PREDICATE_EQUALS.key, value: "NewClass"}),
    ];
  }
  onAfterInitComplete(): void {
    var ob = this.http.get("/odata/Department/?$count=true").pipe(map(x => new ODataResponse<any>(x)));
    ob.subscribe({
      next: data => {
        this.departmentList = data.entities;
      }
    });
  }
  onAfterServerDataReceived(): void {

  }

  onExpanded(ev:RowExpandedEventData){
    console.log(ev);
  }

  onRowSelected(row:any){
    console.log("row selected", row);

  }
}

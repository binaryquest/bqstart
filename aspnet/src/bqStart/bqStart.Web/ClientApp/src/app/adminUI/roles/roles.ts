import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormView, BaseListView } from 'projects/bq-start-prime/src/public-api';


@Component({
  selector: 'app-role-list',
  template: `
    <bq-table [model]='models'
          [metaData]='metaData'
          [tableParams]='tableParams'
          (loadTableData)='onRefreshData()'
          [resizableColumns]='true'
          [loading]='isLoading'
          [showGrid]='true'
          [showStripedGrid]='true'
          [showAddButton]="showAddButton">

  <bq-table-column [field]='metaData.fields.Name'></bq-table-column>
  <bq-table-filter [field]='metaData.fields.Name' [defaultSearchField]="true"></bq-table-filter>

</bq-table>
  `,
  styles: [
  ]
})
export class RoleList extends BaseListView<any> {

  constructor(protected route: ActivatedRoute, protected router:Router) {
    super(route, router, {});
  }

}

@Component({
  selector: 'app-role-form',
  template: `
    <bq-form>
      <bq-text-field [field]="metaData.fields.Name" [(model)]="model.Name"></bq-text-field>
    </bq-form>
  `,
  styles: [
  ]
})
export class RoleForm extends BaseFormView<any> {

  constructor(protected route: ActivatedRoute, protected router:Router) {
    super(route, router, {});
  }

}

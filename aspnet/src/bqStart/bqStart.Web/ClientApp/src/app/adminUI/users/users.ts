import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterService, BaseFormView, BaseListView, IBaseFormViewEvents, IEditFormViewEvents } from 'projects/bq-start-prime/src/public-api';


export class ApplicationUser{
  Id: string;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  FirstName: string;
  LastName: string;
  TimeZoneId: string|null;
  Password: string|null;
  VerifyPassword: string|null;
  EmailConfirmed: boolean;
  AssignedRoles: string[];
}

@Component({
  selector: 'app-user-list',
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

  <bq-table-column [field]='metaData.fields.Email' [caption]="'User Id'"></bq-table-column>
  <bq-table-column [field]='metaData.fields.FirstName'></bq-table-column>
  <bq-table-column [field]='metaData.fields.LastName'></bq-table-column>
  <bq-table-column [field]='metaData.fields.AssignedRoles' [cellTemplate]="cellTemplate">
  <ng-template #cellTemplate let-row="row">
      <span *ngFor="let item of row.AssignedRoles">
      <p-chip [label]="item" icon="pi pi-users"></p-chip>&nbsp;
      </span>
    </ng-template>
  </bq-table-column>

  <bq-table-filter [field]='metaData.fields.Email'></bq-table-filter>
  <bq-table-filter [field]='metaData.fields.FirstName' [defaultSearchField]="true"></bq-table-filter>
  <bq-table-filter [field]='metaData.fields.LastName' [defaultSearchField]="true"></bq-table-filter>

</bq-table>
  `,
  styles: [
  ]
})
export class UserList extends BaseListView<ApplicationUser> {

  constructor(protected routerSvc: RouterService) {
    super(routerSvc, {});
  }

}

@Component({
  selector: 'app-user-form',
  template: `
    <bq-form>
      <bq-text-field [field]="metaData.fields.Email" [(model)]="model.Email" [isRequired]="true" [regexPattern]="emailPattern" [regexMessage]="'Valid email address required'"></bq-text-field>
      <bq-text-field [field]="metaData.fields.FirstName" [(model)]="model.FirstName"></bq-text-field>
      <bq-text-field [field]="metaData.fields.LastName" [(model)]="model.LastName"></bq-text-field>
      <bq-text-field [field]="metaData.fields.PhoneNumber" [(model)]="model.PhoneNumber"></bq-text-field>

      <bq-password-field [field]="metaData.fields.Password" [regexPattern]="'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'" [regexMessage]="'Password should be min 8 char with Upper case and Numbers and Symbols'" [(model)]="model.Password"></bq-password-field>
      <bq-password-field [field]="metaData.fields.VerifyPassword" [(model)]="model.VerifyPassword"></bq-password-field>
      <bq-text-field [field]="metaData.fields.EmailConfirmed" [(model)]="model.EmailConfirmed"></bq-text-field>

      <bq-dropdown-field [field]="metaData.fields.TimeZoneId" [(model)]="model.TimeZoneId" [itemSource]="lookupDataModel.timeZones" displayName="name" valueName="id"></bq-dropdown-field>
      <bq-dropdown-field [field]="metaData.fields.AssignedRoles" [allowMultiple]="true" [(model)]="assignedRolesArray" [itemSource]="lookupDataModel.roles" displayName="name">
        <ng-template bqTemplate="displayLabel">
          <span *ngFor="let item of model.AssignedRoles">
            <p-chip [label]="item" icon="pi pi-users"></p-chip>&nbsp;
          </span>
        </ng-template>
      </bq-dropdown-field>
    </bq-form>
  `,
  styles: [
  ]
})
export class UserForm extends BaseFormView<ApplicationUser> implements IBaseFormViewEvents, IEditFormViewEvents {

  emailPattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

  assignedRolesArray: {name:string}[];

  constructor(protected routerSvc: RouterService) {
    super(routerSvc, {});
  }

  onBeforeSave(): boolean {
    if (this.assignedRolesArray !== null && this.assignedRolesArray !== undefined){
      this.model.AssignedRoles = this.assignedRolesArray.map(x => x.name);
    }
    return true;
  }

  onBeforeDelete(): boolean {
    if (this.user?.name == this.model.UserName){
      alert("you can not delete the user that you are current logged in as");
      return false;
    }
    return true;
  }

  onAfterInitComplete(): void {

  }

  onAfterServerDataReceived(): void {
    this.assignedRolesArray = [];
    if (this.model !== null){
      if (this.model.AssignedRoles !== null && this.model.AssignedRoles !== undefined && this.model.AssignedRoles.length>0){
        this.assignedRolesArray = this.model.AssignedRoles.map(x => {return {name: x}});
      }
    }
  }

  override createEmptyModel(): ApplicationUser {
    let ret =  new ApplicationUser();
    ret.Password = "";
    ret.VerifyPassword = "";
    this.assignedRolesArray = [];
    return ret;
  }
}

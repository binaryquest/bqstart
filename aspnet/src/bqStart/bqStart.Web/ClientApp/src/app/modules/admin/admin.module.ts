import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BQStartPrimeModule } from "bq-start-prime";
import { ConfirmationService } from 'primeng/api';
import { ExampleFormComponent } from './example-form/example-form.component';
import { ExampleListComponent } from './example-list/example-list.component';



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
        { path: 'custom', component: AdminComponent },
    ]),
    BQStartPrimeModule,
],
  exports: [
    AdminComponent,
  ],
  declarations: [
    AdminComponent,
    ExampleListComponent,
    ExampleFormComponent
  ],
  providers: [],
})
export class AdminModule {
  public getAdminComponent(){
    return AdminComponent;
  }
  public getExampleListComponent(){
    return ExampleListComponent;
  }
  public getExampleFormComponent(){
    return ExampleFormComponent;
  }
}

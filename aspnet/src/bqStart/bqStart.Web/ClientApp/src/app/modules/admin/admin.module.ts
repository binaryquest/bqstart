import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BQStartPrimeModule } from "../../../../projects/bq-start-prime/src/lib/bq-start-prime.module";
import { ConfirmationService } from 'primeng/api';



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
        { path: 'manage-users', component: AdminComponent },
    ]),
    BQStartPrimeModule
],
  exports: [
    AdminComponent,
  ],
  declarations: [AdminComponent],
  providers: [ConfirmationService],
})
export class AdminModule {
  public getAdminComponent(){
    return AdminComponent;
  }
}

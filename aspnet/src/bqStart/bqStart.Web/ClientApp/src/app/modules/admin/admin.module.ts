import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BQStartPrimeModule } from 'projects/bq-start-prime/bq-start-module';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'manage-users', component: AdminComponent },
    ])
  ],
  exports: [
    AdminComponent,
  ],
  declarations: [AdminComponent],
  providers: [],
})
export class AdminModule {
  public getAdminComponent(){
    return AdminComponent;
  }
}

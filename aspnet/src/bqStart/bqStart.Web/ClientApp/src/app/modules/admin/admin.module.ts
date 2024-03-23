import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'manage-users', component: AdminComponent },
    ])
  ],
  exports: [AdminComponent],
  declarations: [AdminComponent],
  providers: [],
})
export class AdminModule {
  public getAdminComponent(){
    return AdminComponent;
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';

import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { RoleList, RoleForm } from './adminUI/roles/roles';
import { UserList, UserForm } from './adminUI/users/users';

import { BQStartPrimeModule, AuthorizeGuard, AuthorizeInterceptor, LocaleProvider, LocaleService } from 'projects/bq-start-prime/bq-start-module';
import { APP_CONFIG } from './app.config';

//language locals
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeBn from '@angular/common/locales/bn';
import localeSg from '@angular/common/locales/en-SG';
import { DepartmentListComponent } from './example/department-list/department-list.component';
import { DepartmentFormComponent } from './example/department-form/department-form.component';
import { ExampleFormComponent } from './example/example-form/example-form.component';
import { ExampleListComponent } from './example/example-list/example-list.component';



registerLocaleData(localeBn);
registerLocaleData(localeSg);

// // AoT requires an exported function for factories
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
// }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    DepartmentListComponent,
    DepartmentFormComponent,
    ExampleFormComponent,
    ExampleListComponent,
    RoleList,
    RoleForm,
    UserList,
    UserForm
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    CheckboxModule,
    RadioButtonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    TranslateModule.forRoot(),
    BQStartPrimeModule.forRoot(APP_CONFIG),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthorizeGuard] },
      { path: 'counter', component: CounterComponent },
      //{ path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard] },
    ]
    )
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    LocaleProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

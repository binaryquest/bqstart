import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthorizeService } from './api-authorization/authorize.service';
import { LoginMenuComponent } from './api-authorization/login-menu/login-menu.component';
import { LoginComponent } from './api-authorization/login/login.component';
import { LogoutComponent } from './api-authorization/logout/logout.component';
import { TopBar } from './ui/layout/top-bar/top-bar';
import { BQAdminConfigService, BQConfigData } from './config/bq-start-config';
import { FooterBar } from './ui/layout/footer-bar/footer-bar';
import { AppInjector } from './services/app-injector.service';
import { AppLayout } from './ui/layout/app-layout/app-layout';
import { MenuBar } from './ui/layout/menu-bar/menu-bar';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from './ui/base.component';
import { AppInitService } from './services/app-init.service';
import { BaseListView } from './ui/core/base-list-view';
import { BaseFormView } from './ui/core/base-form-view';
import { MetaDataService } from './services/meta-data.service';
import { MessageService } from './services/message.service';
import { Table } from './ui/controls/bq-table/bq-table';
import { TableColumn } from './ui/controls/bq-table/bq-table-column';
import {TableModule} from 'primeng/table';
import { LocaleService } from './services/locale.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { GenericDataService } from './services/generic-data.service';
import { TableFilters } from './ui/controls/bq-table/bq-table-filters';
import { TableFilter } from './ui/controls/bq-table/bq-table-filter';

// PrimeNG
import { CardModule } from 'primeng/card';
import { MessageService as PrimeMS, ConfirmationService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ChipsModule } from 'primeng/chips';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';

import { NgSelectModule } from '@ng-select/ng-select';

import { ChipsMenu } from './ui/controls/bq-chips-menu/bq-chips-menu';
import { CustomFilter } from './ui/controls/bq-table/bq-table-custom-filter';
import { InternalLogService, LogService, LogPublishersService } from './services/log/log.service';
import { Breadcrumb } from './ui/layout/breadcrumb/breadcrumb';
import { NavigationService } from './services/navigation.service';
import { ViewWrapper } from './ui/controls/view-wrapper/view-wrapper';
import { ViewWrapperService } from './ui/controls/view-wrapper/view-wrapper.service';
import { BQTemplate } from './ui/core/bq-template.directive';
import { DialogService } from './services/dialog.service';
import { FormBlock } from './ui/controls/form-block/form-block';
import { BqTextField } from './ui/controls/bq-text-field/bq-text-field';
import { ModelValuePipe } from './ui/core/model-value.pipe';
import { ControlContainerDirective } from './ui/core/control-container.directive';
import { BqForm } from './ui/controls/bq-form/bq-form';
import { CompareDirective } from './ui/controls/validators/compare.directive';
import { BoolToYesNoPipe, PasswordPipe } from './ui/core/display.pipes';
import { BqPasswordField } from './ui/controls/bq-password-field/bq-password-field';
import { BqDropdownField } from './ui/controls/bq-dropdown-field/bq-dropdown-field';
export * from './models/meta-data';




export function initializeApp(appInitService: AppInitService) {
  const ret = (): Promise<any> => {
    return appInitService.Init();
  }
  return ret;
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    CardModule,
    ToastModule,
    TableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: LocaleService,
        deps: [HttpClient]
      },
    }),
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    MenuModule,
    ChipsModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    ToolbarModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DialogModule,
    PasswordModule,
    ProgressBarModule,
    NgSelectModule,
    MessagesModule,
    MessageModule
  ],
  declarations: [
    LoginMenuComponent,
    LoginComponent,
    LogoutComponent,
    TopBar,
    FooterBar,
    AppLayout,
    MenuBar,
    BaseComponent,
    BaseListView,
    BaseFormView,
    Table,
    TableColumn,
    TableFilters,
    TableFilter,
    CustomFilter,
    ChipsMenu,
    Breadcrumb,
    ViewWrapper,
    BQTemplate,
    FormBlock,
    BqTextField,
    ModelValuePipe,
    ControlContainerDirective,
    BqForm,
    CompareDirective,
    BoolToYesNoPipe,
    PasswordPipe,
    BqPasswordField,
    BqDropdownField
  ],
  exports: [
    LoginMenuComponent,
    LoginComponent,
    LogoutComponent,
    TopBar,
    FooterBar,
    AppLayout,
    Breadcrumb,
    BaseListView,
    BaseFormView,
    Table,
    TableColumn,
    TableFilter,
    BQTemplate,
    FormBlock,
    BqTextField,
    ModelValuePipe,
    //PrimeNG
    CardModule,
    ToastModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    MenuModule,
    ChipsModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    ToolbarModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DialogModule,
    PasswordModule,
    ProgressBarModule,
    NgSelectModule,
    MessagesModule,
    MessageModule,
    //bq
    BqForm,
    CompareDirective,
    BoolToYesNoPipe,
    PasswordPipe,
    BqPasswordField,
    BqDropdownField
  ],
  providers: [
    AuthorizeService,
    AppInjector,
    AppInitService,
    MetaDataService,
    MessageService,
    PrimeMS,
    LocaleService,
    LogPublishersService,
    LogService,
    NavigationService,
    ViewWrapperService,
    DialogService,
    ConfirmationService
  ]
})
export class BQStartPrimeModule {

  constructor(injector: Injector) { AppInjector.setInjector(injector); }

  static forRoot(config: BQConfigData): ModuleWithProviders<BQStartPrimeModule> {
    return {
      ngModule: BQStartPrimeModule,
      providers: [
        { provide: BQAdminConfigService, useValue: config },
        {
          provide:
            APP_INITIALIZER,
          useFactory: initializeApp,
          deps: [AppInitService, Router],
          multi: true
        },
        { provide: InternalLogService }
      ]
    }
  }

}

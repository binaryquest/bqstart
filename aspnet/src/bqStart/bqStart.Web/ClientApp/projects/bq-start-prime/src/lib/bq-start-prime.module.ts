import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppInitService } from './services/app-init.service';
import { AuthorizeGuard } from './api-authorization/authorize.guard';
import { FormsModule } from '@angular/forms';
import { AppInjector } from './services/app-injector.service';
import { BQConfigData, BQConfigService } from 'bq-start-core';
import { InternalLogService, LogPublishersService, LogService } from './services/log/log.service';
import { LocaleService } from './services/locale.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from './services/dialog.service';
import { MessageService } from './services/message.service';
import { KeyShortcutService } from './services/keyShortcut.service';
import { AuthorizeService } from './api-authorization/authorize.service';
import { LoginMenuComponent } from './api-authorization/login-menu/login-menu.component';
import { LoginComponent } from './api-authorization/login/login.component';
import { LogoutComponent } from './api-authorization/logout/logout.component';
import { TopBar } from './ui/layout/top-bar/top-bar';
import { FooterBar } from './ui/layout/footer-bar/footer-bar';
import { AppLayout } from './ui/layout/app-layout/app-layout';
import { MenuBar } from './ui/layout/menu-bar/menu-bar';
import { BaseComponent } from './ui/base.component';
import { BaseListView } from './ui/core/base-list-view';
import { BaseFormView } from './ui/core/base-form-view';
import { Message } from './services/message.service';
import { Table } from './ui/controls/bq-table/bq-table';
import { TableColumn } from './ui/controls/bq-table/bq-table-column';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { GenericDataService } from './services/generic-data.service';
import { TableFilters } from './ui/controls/bq-table/bq-table-filters';
import { TableFilter } from './ui/controls/bq-table/bq-table-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { KeyboardShortcutsModule }     from 'ng-keyboard-shortcuts';
import { ChipsMenu } from './ui/controls/bq-chips-menu/bq-chips-menu';
import { CustomFilter } from './ui/controls/bq-table/bq-table-custom-filter';
import { Breadcrumb } from './ui/layout/breadcrumb/breadcrumb';
import { ViewWrapper } from './ui/controls/view-wrapper/view-wrapper';
import { BQTemplate } from './ui/core/bq-template.directive';
import { FormBlock } from './ui/controls/form-block/form-block';
import { BqTextField } from './ui/controls/bq-text-field/bq-text-field';
import { ModelValuePipe } from './ui/core/model-value.pipe';
import { ControlContainerDirective } from './ui/core/control-container.directive';
import { BqForm } from './ui/controls/bq-form/bq-form';
import { CompareDirective } from './ui/controls/validators/compare.directive';
import { BoolToYesNoPipe, PasswordPipe } from './ui/core/display.pipes';
import { BqPasswordField } from './ui/controls/bq-password-field/bq-password-field';
import { BqDropdownField } from './ui/controls/bq-dropdown-field/bq-dropdown-field';
import { BqTextArea } from './ui/controls/bq-text-area/bq-text-area';
import { TopMenuBar } from './ui/layout/top-menu-bar/top-menu-bar';
import { DynamicHostDirective } from './ui/core/dynamic-host.directive';
import { DynamicLoaderComponent, DynamicMDILoaderComponent } from './ui/core/dynamic.component';
import { MDIComponent } from './ui/layout/mdi/mdi.component';
import { MDILayoutComponent } from './ui/layout/mdi/mdi-layout';

// PrimeNG
import { Card } from 'primeng/card';
import { MessageService as PrimeMS } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { Menu } from 'primeng/menu';
import { Chip } from 'primeng/chip';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Toolbar } from 'primeng/toolbar';
import { RadioButton } from 'primeng/radiobutton';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { Password } from 'primeng/password';
import { ProgressBar } from 'primeng/progressbar';
import { Message as PrimeMessage } from 'primeng/message';
import { Avatar } from 'primeng/avatar';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { BlockUI } from 'primeng/blockui';
import { Select } from 'primeng/select';
import { Popover } from 'primeng/popover';
import { MetaDataService } from './services/meta-data.service';
import { NavigationService } from './services/navigation.service';
import { RouterService } from './services/router.service';
import { ViewWrapperService } from './ui/controls/view-wrapper/view-wrapper.service';
import { MainRegionAdapterService } from './services/mainRegionAdapter.service';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { SplitButton } from 'primeng/splitbutton';
import { Breadcrumb as PrimeBreadcrumb } from 'primeng/breadcrumb';
import { DatePicker } from 'primeng/datepicker';

export function initializeApp(appInitService: AppInitService) {
  const ret = (): Promise<any> => {
    appInitService.tabbedMDIRoutes = [
      // {
      //   path: `mdi`,
      //   component: MDIComponent,
      //   data: { },
      //   canActivate: [AuthorizeGuard]
      // },
      // {
      //   path: `Home`,
      //   redirectTo: '/mdi',
      //   pathMatch: 'full'
      // },
      // {
      //   path: ``,
      //   redirectTo: '/mdi',
      //   pathMatch: 'full'
      // }
    ]
    return appInitService.Init();
  }
  return ret;
}

/**
 *  Main Entry point Module for bqStart
 *
 * @export
 * @class BQStartPrimeModule
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    Card,
    Toast,
    TableModule,
    SplitButton,
    PanelModule,
    KeyboardShortcutsModule.forRoot(),
    TranslateModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useClass: LocaleService,
    //     deps: [HttpClient]
    //   },
    // }),
    ButtonModule,
    Tooltip,
    Popover,
    Menu,
    Chip,
    InputText,
    TextareaModule,
    Select,
    InputNumber,
    Checkbox,
    Toolbar,
    RadioButton,
    ConfirmDialog,
    Dialog,
    Password,
    ProgressBar,
    NgSelectModule,
    PrimeMessage,
    Chip,
    Avatar,
    Menubar,
    TabsModule,
    BlockUI,
    MenubarModule,
    ConfirmDialogModule,
    PrimeBreadcrumb,
    DatePicker
  ],
  declarations: [
    LoginMenuComponent,
    LoginComponent,
    LogoutComponent,
    TopBar,
    FooterBar,
    AppLayout,
    MenuBar,
    TopMenuBar,
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
    BqDropdownField,
    BqTextArea,
    DynamicHostDirective,
    DynamicLoaderComponent,
    DynamicMDILoaderComponent,
    MDIComponent,
    MDILayoutComponent
  ],
  exports: [
    LoginMenuComponent,
    LoginComponent,
    LogoutComponent,
    TopBar,
    TopMenuBar,
    FooterBar,
    AppLayout,
    ViewWrapper,
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
    MDILayoutComponent,
    // //PrimeNG
    ButtonModule,
    Tooltip,
    Menu,
    Chip,
    InputText,
    TextareaModule,
    Select,
    InputNumber,
    Checkbox,
    Toolbar,
    RadioButton,
    ConfirmDialog,
    Dialog,
    Password,
    ProgressBar,
    NgSelectModule,
    PrimeMessage,
    Chip,
    Avatar,
    Menubar,
    TabsModule,
    BlockUI,
    TableModule,
    // //bq
    BqForm,
    CompareDirective,
    BoolToYesNoPipe,
    PasswordPipe,
    BqPasswordField,
    BqDropdownField,
    BqTextArea,
    DynamicHostDirective,
    DynamicLoaderComponent,
    DynamicMDILoaderComponent,
    MDIComponent,
    MDILayoutComponent
  ],
  providers: [
    AuthorizeService,
    AppInjector,
    AppInitService,
    MetaDataService,
    // MessageService,
    // PrimeMS,
    //LocaleService,
    //LogPublishersService,
    //LogService,
    //NavigationService,
    //ViewWrapperService,
    //DialogService,
    ////ConfirmationService,
    //RouterService,
    //MainRegionAdapterService,
    //KeyShortcutService
  ]
})
export class BQStartPrimeModule {

  constructor(injector: Injector) {
    console.log(">> bq start module init");
    AppInjector.setInjector(injector);
  }

  static forRoot(config: BQConfigData): ModuleWithProviders<BQStartPrimeModule> {

    return {
      ngModule: BQStartPrimeModule,
      providers: [
        { provide: BQConfigService, useValue: config },
        {
          provide:
            APP_INITIALIZER,
          useFactory: initializeApp,
          deps: [AppInitService, Router],
          multi: true
        },
        { provide: InternalLogService },
        //LocaleService,
        //ConfirmationService,
        //DialogService,
        //PrimeMS,
        //MessageService,
        //KeyShortcutService
      ]
    }
  }

}

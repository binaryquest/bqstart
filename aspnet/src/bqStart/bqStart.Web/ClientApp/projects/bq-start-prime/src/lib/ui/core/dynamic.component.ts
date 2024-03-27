import { AfterContentInit, AfterViewInit, Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFactoryCallBack, MenuData, RouteData } from '../../config/bq-start-config';
import { AppInjector } from '../../services/app-injector.service';
import { MainRegionAdapterService, ViewRunningData } from '../../services/mainRegionAdapter.service';
import { RouterService } from '../../services/router.service';
import { DynamicHostDirective } from './dynamic-host.directive';
import { DialogService } from '../../services/dialog.service';
import { ConfirmationService } from 'primeng/api';
import { LocaleService } from '../../services/locale.service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'dyn-loader',
  template: `
<ng-template dynHost></ng-template>
`
})

export class DynamicLoaderComponent implements AfterContentInit, OnDestroy {

  @ViewChild(DynamicHostDirective, {static: true}) adHost!: DynamicHostDirective;
  private componentType: any;
  private componentFactory?: ComponentFactoryCallBack;
  private injector: Injector;
  constructor(protected route: ActivatedRoute,
    protected router: Router,
    protected regionSvc:MainRegionAdapterService,
    protected dialogSvc:DialogService,
    protected confService:ConfirmationService,
    protected localSvc: LocaleService,
    protected tranSvc: TranslateService,
    protected navSvc: NavigationService) {
    this.componentType = route.snapshot.data['componentType'];
    if (route.snapshot.data['componentFactory']){
      this.componentFactory = route.snapshot.data['componentFactory'];
    }
    this.injector = AppInjector.getInjector();
  }

  ngAfterContentInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  async loadComponent() {

    const routerSvc: RouterService = new RouterService(this.route, this.router, this.regionSvc);

    const injector =
    Injector.create({providers: [
      {provide: RouterService, useValue:routerSvc},
      {provide: DialogService, useValue:this.dialogSvc},
      {provide: ConfirmationService, useValue:this.confService},
      {provide: LocaleService, useValue:this.localSvc},
      {provide: TranslateService, useValue:this.tranSvc},
      {provide: NavigationService, useValue:this.navSvc},
    ], parent: this.injector},);


    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    if (this.componentFactory){
      this.componentType = await this.componentFactory(this.injector);
    }
    const componentRef = viewContainerRef.createComponent(this.componentType, {injector: injector});

  }
}

@Component({
  selector: 'dyn-mdi-loader',
  template: `
<ng-template dynHost></ng-template>
`
})

export class DynamicMDILoaderComponent implements AfterContentInit, OnDestroy {

  component: any;

  @Input()
  viewRunningData: ViewRunningData;

  @ViewChild(DynamicHostDirective, {static: true}) adHost!: DynamicHostDirective;

  private injector: Injector;
  constructor(protected route: ActivatedRoute, protected router: Router,
    protected regionSvc:MainRegionAdapterService,
    protected dialogSvc:DialogService,
    protected confService:ConfirmationService,
    protected localSvc: LocaleService,
    protected tranSvc: TranslateService,
    protected navSvc: NavigationService) {
    this.injector = AppInjector.getInjector();
  }

  ngAfterContentInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  async loadComponent() {

    if (this.viewRunningData.viewDef.component){
      this.component = this.viewRunningData.viewDef.component;
    }else if (this.viewRunningData.viewDef.componentFactory){
      this.component = await this.viewRunningData.viewDef.componentFactory(this.injector);
    }
    const routerSvc: RouterService = new RouterService(this.route, this.router, this.regionSvc, this.viewRunningData.routeData);

    const injector =
    Injector.create({providers: [
      {provide: RouterService, useValue:routerSvc},
      {provide: DialogService, useValue:this.dialogSvc},
      {provide: ConfirmationService, useValue:this.confService},
      {provide: LocaleService, useValue:this.localSvc},
      {provide: TranslateService, useValue:this.tranSvc},
      {provide: NavigationService, useValue:this.navSvc},
    ], parent: this.injector},);


    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(this.component, {injector: injector});

    this.viewRunningData.routeData.instance = componentRef.instance;

  }
}

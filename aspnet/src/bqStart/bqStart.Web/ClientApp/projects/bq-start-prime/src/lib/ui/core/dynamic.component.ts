import { AfterContentInit, AfterViewInit, Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuData } from '../../config/bq-start-config';
import { RouteData } from '../../services/app-init.service';
import { AppInjector } from '../../services/app-injector.service';
import { MainRegionAdapterService, ViewRunningData } from '../../services/mainRegionAdapter.service';
import { RouterService } from '../../services/router.service';
import { DynamicHostDirective } from './dynamic-host.directive';

@Component({
  selector: 'dyn-loader',
  template: `
<ng-template dynHost></ng-template>
`
})

export class DynamicLoaderComponent implements AfterContentInit, OnDestroy {

  @ViewChild(DynamicHostDirective, {static: true}) adHost!: DynamicHostDirective;
  private componentType: any;
  private injector: Injector;
  constructor(protected route: ActivatedRoute, protected router: Router, protected regionSvc:MainRegionAdapterService) {
    console.log("DynamicLoaderComponent.init");
    this.componentType = route.snapshot.data.componentType;
    this.injector = AppInjector.getInjector();
  }

  ngAfterContentInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  loadComponent() {

    console.log("DynamicLoaderComponent.loadC");
    const routerSvc: RouterService = new RouterService(this.route, this.router, this.regionSvc);

    const injector =
    Injector.create({providers: [{provide: RouterService, useValue:routerSvc}], parent: this.injector},);


    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

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
  constructor(protected route: ActivatedRoute, protected router: Router, protected regionSvc:MainRegionAdapterService) {
    console.log("DynamicLoaderComponent.init");
    this.injector = AppInjector.getInjector();
  }

  ngAfterContentInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  loadComponent() {

    console.log("DynamicMDILoaderComponent.loadC");
    this.component = this.viewRunningData.viewDef.component;
    const routerSvc: RouterService = new RouterService(this.route, this.router, this.regionSvc, this.viewRunningData.routeData);

    const injector =
    Injector.create({providers: [{provide: RouterService, useValue:routerSvc}], parent: this.injector},);


    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(this.component, {injector: injector});

    this.viewRunningData.routeData.instance = componentRef.instance;

  }
}

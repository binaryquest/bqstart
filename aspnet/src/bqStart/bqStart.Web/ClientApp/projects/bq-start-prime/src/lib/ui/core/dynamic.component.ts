import { AfterContentInit, AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppInjector } from '../../services/app-injector.service';
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
  constructor(protected route: ActivatedRoute, protected router: Router) {
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
    const routerSvc: RouterService = new RouterService(this.route, this.router);

    const injector =
    Injector.create({providers: [{provide: RouterService, useValue:routerSvc}], parent: this.injector},);


    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(this.componentType, {injector: injector});

  }
}

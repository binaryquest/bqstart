import { Component, Input, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { BQConfigData, BQConfigService } from '../../../config/bq-start-config';
import { AppInjector } from '../../../services/app-injector.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';

/**
 * Main layout component for showing views as a Tabbed MDI interface. The config option should
 * also be True.
 *
 * @export
 * @class MDILayoutComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'bq-mdi-app-layout',
  styles: [`
  .mdi-layout {
    height: calc(100vh - 60px);
  }`
  ],
  template: `
<div class="layout-wrapper">
<bq-top-menu-bar></bq-top-menu-bar>
<div class="layout-content-inactive mdi-layout flex flex-column">
    <div class="flex-grow-1 flex flex-column" style="overflow-y: scroll;height:83vh;padding: 3px;">
      <view-wrapper>
        <ng-content></ng-content>
      </view-wrapper>
    </div>
    <bq-footer-bar *ngIf="isAuthenticated" class="flex-shrink flex align-items-stretch"></bq-footer-bar>
</div>
</div>
<p-toast class="flex-none"></p-toast>
`
},)

export class MDILayoutComponent implements OnInit {

  isAuthenticated: boolean;

  @Input()
  injector: any;
  config: BQConfigData;

  constructor(private primengConfig: PrimeNGConfig, private authorizeService: AuthorizeService) {
    this.authorizeService.isAuthenticated().subscribe(x => {
      this.isAuthenticated = x;
    });
    this.injector = AppInjector.getInjector();
    this.config = this.injector.get(BQConfigService);
  }

  ngOnInit() { }
}


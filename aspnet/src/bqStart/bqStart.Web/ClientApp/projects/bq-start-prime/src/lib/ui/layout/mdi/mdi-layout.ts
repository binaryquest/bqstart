import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { BQConfigData, BQConfigService } from '../../../config/bq-start-config';
import { AppInjector } from '../../../services/app-injector.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';
import { BQTemplate } from '../../core/bq-template.directive';
import { Dictionary } from '../../../models/meta-data';

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
  styles: [
    `
      .mdi-layout {
        height: calc(100vh - 60px);
      }
    `,
  ],
  template: `
    <div class="layout-wrapper">
      <bq-top-menu-bar (onTopRightMenuClicked)="handleTopMenuClick($event)"></bq-top-menu-bar>
      <div class="layout-content-inactive mdi-layout flex flex-column">
        <div
          class="flex-grow-1 flex flex-column"
          style="overflow-y: scroll;height:83vh;padding: 3px;"
        >
          <view-wrapper
            ><bq-mdi>
              <ng-content></ng-content>
            </bq-mdi>
          </view-wrapper>
        </div>
        <div class="flex-shrink flex align-items-stretch">
          <div class="layout-footer flex-grow-1 p-3">
            <ng-container [ngTemplateOutlet]="controlFooterTemplate" *ngIf="isAuthenticated"></ng-container>
          </div>
        </div>
      </div>
    </div>
    <p-toast class="flex-none"></p-toast>
    <ng-template #defaultFooterTemplate>
      <bq-footer-bar></bq-footer-bar>
    </ng-template>
  `,
})
export class MDILayoutComponent implements OnInit, AfterContentInit {
  isAuthenticated: boolean;

  @Input()
  injector: any;
  config: BQConfigData;

  @ViewChild('defaultFooterTemplate', { static: true }) defaultFooterTemplate: TemplateRef<any>;
  controlFooterTemplate: TemplateRef<any>;
  customFooterTemplate: TemplateRef<any>;
  @ContentChildren(BQTemplate) templates: QueryList<BQTemplate>;
  optionalTemplates: Dictionary<TemplateRef<any>> = {};

  @Output() onTopRightMenuClicked: EventEmitter<any> = new EventEmitter();

  constructor(
    private primengConfig: PrimeNGConfig,
    private authorizeService: AuthorizeService
  ) {
    this.authorizeService.isAuthenticated().subscribe((x) => {
      this.isAuthenticated = x;
    });
    this.injector = AppInjector.getInjector();
    this.config = this.injector.get(BQConfigService);
  }

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "footer":
          this.customFooterTemplate = item.template;
          break;
        default:
          this.optionalTemplates[item.getType()] = item.template;
          break;
      }
    });
    this.controlFooterTemplate = this.customFooterTemplate ?? this.defaultFooterTemplate;
  }

  handleTopMenuClick(ev:any){
    this.onTopRightMenuClicked.emit(ev);
  }
}

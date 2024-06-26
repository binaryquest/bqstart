import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { BQConfigData, BQConfigService } from 'bq-start-core';
import { AppInjector } from '../../../services/app-injector.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';
import { BQTemplate } from '../../core/bq-template.directive';
import { Dictionary } from 'bq-start-core';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';

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
    <ng-keyboard-shortcuts [shortcuts]="shortcutsInternal"></ng-keyboard-shortcuts>
    <ng-keyboard-shortcuts-help [key]="'f1'" [closeKey]="'escape'" [title]="'Keyboard Shotcuts'"></ng-keyboard-shortcuts-help>
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

  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

  shortcutsInternal: ShortcutInput[] = [];
  private _shortcuts: ShortcutInput[] = [];
  private _shortcutsDefault: ShortcutInput[] = [
    {
      key: "ctl + s",
      label: "Save Command",
      description: "Default Save Command for any form",
      command: () => console.log('app ctl + s'),
      preventDefault: true
    }
  ];

  /**
   * This is the list of shortcut keyboard hooks to patch to the module
   *
   * @type {ShortcutInput[]}
   * @memberof AppLayout
   */
  @Input() set shortcuts(value: ShortcutInput[]) {
    this._shortcuts = value;
    let vv = value ?? [];
    this.shortcutsInternal = [...vv, ...this._shortcutsDefault];
  }
  get shortcuts(): ShortcutInput[] {
    // other logic
    return this._shortcuts;
  }

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
    let vv = this.shortcuts ?? [];
    this.shortcutsInternal = [...vv, ...this._shortcutsDefault];
  }

  handleTopMenuClick(ev:any){
    this.onTopRightMenuClicked.emit(ev);
  }
}

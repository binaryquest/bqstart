import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { BQConfigService, BQConfigData } from 'bq-start-core';
import { AppInjector } from '../../../services/app-injector.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';
import { BQTemplate } from '../../core/bq-template.directive';
import { Dictionary } from 'bq-start-core';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { DialogService } from '../../../services/dialog.service';
import { KeyShortcutService } from '../../../services/keyShortcut.service';

/**
 * Main layout Component which is responsible for showing Menu bar footer etc
 *
 * @export
 * @class AppLayout
 * @implements {OnInit}
 */
@Component({
  selector: 'bq-app-layout',
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss'],
})
export class AppLayout implements OnInit, AfterContentInit {

  title = 'app';
  menuActive: boolean;
  showLeftMenu: boolean;
  isAuthenticated: boolean;
  injector: any;
  config: BQConfigData;
  dialogVisible: boolean = false;
  dialogMsg: string = "";
  dialogHeader: string = "";

  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

  /**
   * Display the footer always on bottom if true.
   *
   * @type {boolean}
   * @memberof AppLayout
   */
  @Input()
  stickyFooter: boolean = false;

  /**
   * If the Menu bar will be shown horizontally on top or vertically of left sidebar
   *
   * @type {boolean}
   * @memberof AppLayout
   */
  @Input()
  showMenuOnTop: boolean = false;

  @ViewChild('defaultFooterTemplate', { static: true }) defaultFooterTemplate: TemplateRef<any>;
  @ViewChild('defaultTopRightTemplate', { static: true }) defaultTopRightTemplate: TemplateRef<any>;
  controlFooterTemplate: TemplateRef<any>;
  customFooterTemplate: TemplateRef<any>;
  @ContentChildren(BQTemplate) templates: QueryList<BQTemplate>;
  optionalTemplates: Dictionary<TemplateRef<any>> = {};
  customTopRightMenuTemplate: TemplateRef<any>;

  @Output() onTopRightMenuClicked: EventEmitter<any> = new EventEmitter();

  dialogService: DialogService;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authorizeService: AuthorizeService,
    public keySvc:KeyShortcutService
  ) {
    this.authorizeService.isAuthenticated().subscribe((x) => {
      this.showLeftMenu = x && !this.showMenuOnTop;
      this.isAuthenticated = x;
    });
    this.injector = AppInjector.getInjector();
    this.config = this.injector.get(BQConfigService);
    this.dialogService = this.injector.get(DialogService);
    this.dialogService.alertStore.subscribe({
      next:(val) => {
        this.dialogMsg = val.msg;
        this.dialogHeader = val.heading;
        this.dialogVisible = true;
      }
    });
  }

  ngAfterContentInit(): void {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "footer":
          this.customFooterTemplate = item.template;
          break;
        case "topRight":
          this.customTopRightMenuTemplate = item.template;
          break;
        default:
          this.optionalTemplates[item.getType()] = item.template;
          break;
      }
    });
    this.controlFooterTemplate = this.customFooterTemplate ?? this.defaultFooterTemplate;
    this.customTopRightMenuTemplate = this.customTopRightMenuTemplate ?? this.defaultTopRightTemplate;
  }

  handleTopMenuClick(ev:any){
    this.onTopRightMenuClicked.emit(ev);
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onMenuButtonClick() {
    this.menuActive = true;
    this.addClass(document.body, 'blocked-scroll');
  }

  onMaskClick() {
    this.hideMenu();
  }

  hideMenu() {
    this.menuActive = false;
    this.removeClass(document.body, 'blocked-scroll');
  }

  addClass(element: any, className: string) {
    if (element.classList) element.classList.add(className);
    else element.className += ' ' + className;
  }

  removeClass(element: any, className: string) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
  }
}

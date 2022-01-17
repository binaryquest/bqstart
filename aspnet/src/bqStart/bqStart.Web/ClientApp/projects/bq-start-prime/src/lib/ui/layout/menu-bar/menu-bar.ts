import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from 'primeng/api';
import { MenuData } from '../../../config/bq-start-config';
import { BaseComponent } from '../../base.component';
import { TranslateModule } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { BaseMenu } from '../base.menu';
import { RouterService } from '../../../services/router.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';

@Component({
  selector: 'bq-menu-bar',
  templateUrl: './menu-bar.html',
  styleUrls: ['./menu-bar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden',
        opacity: 0,
      })),
      state('visible', style({
        height: '*',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ])
  ]
})
export class MenuBar extends BaseMenu implements OnInit {

  @Input() active: boolean;

  activeSubmenus: { [key: string]: boolean } = {};
  menus: MenuData[];

  constructor(protected router: Router, protected regionSvc: MainRegionAdapterService, private pageTitle:Title) {
    super(router, regionSvc);

    this.menus = JSON.parse(JSON.stringify(this.config.menus));

    if (this.menus === undefined || this.menus === null) {
      console.debug("Application Menus not defined");
    }else{
      this.recurseMapMenu(this.menus);
    }
  }

  ngOnInit(): void {
  }


  toggleSubmenu(event: Event, menu: MenuData) {
    this.activeSubmenus[menu.label] = this.activeSubmenus[menu.label] ? false : true;
    menu.isExpanded = menu.isExpanded ? false : true;
    event.preventDefault();
  }

  isSubmenuActive(menu: MenuData) {
    if (this.activeSubmenus.hasOwnProperty(menu.label)) {
      return this.activeSubmenus[menu.label];
    }
    if (menu.childMenus.length > 0) {
      for (let index = 0; index < menu.childMenus.length; index++) {
        const element = menu.childMenus[index];
        if (element.path !== undefined)
          if (this.router.isActive(element.path, false)) {
            return true;
          }
      }
    }

    return false;
  }

  menuClicked(menuDef: MenuData){
    if (menuDef!=null && menuDef.label!=null){
      this.pageTitle.setTitle(menuDef.label + " - " + this.config.applicationName);
    }
  }
}

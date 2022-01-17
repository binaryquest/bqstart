import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuItemContent } from 'primeng/menu';
import { Subscription } from 'rxjs';
import { ApplicationPaths } from '../../../api-authorization/api-authorization.constants';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { BQConfigData, BQConfigService, MenuData } from '../../../config/bq-start-config';
import { AppInjector } from '../../../services/app-injector.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';
import { RouterService } from '../../../services/router.service';
import { BaseMenu } from '../base.menu';
import { TopBar } from '../top-bar/top-bar';


@Component({
  selector: 'bq-top-menu-bar',
  template: `

<p-menubar [model]="items">
    <ng-template pTemplate="start">
        <img alt="logo" [src]="logo" height="40" class="pr-2 md:inline hidden">
    </ng-template>
    <ng-template pTemplate="end">
    <p-slideMenu #menu [model]="userMenus" [popup]="true" [viewportHeight]="115"></p-slideMenu>
      <button pButton pRipple
        #btn
        type="button"
        icon="pi pi-user"
        class="p-button-rounded p-button-info"
        (click)="menu.toggle($event)"></button>
    </ng-template>
</p-menubar>

  `
})

export class TopMenuBar extends BaseMenu {

  items: MenuItem[];
  userMenus: MenuItem[];
  logo: string;
  logoutPath: string;
  loginPath: string;
  menuData: MenuData[];

  constructor(protected router: Router, protected regionSvc: MainRegionAdapterService) {
    super(router, regionSvc);

    this.authorizeService.isAuthenticated().subscribe(x => this.authenticationChanged(x));
    this.logo = this.config.logoUrl ?? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAABICAYAAADbPm9XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUQ2REQ0QTcxOUFCMTFFQkE5RkE5NDVDMUU1NTJCMzAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUQ2REQ0QTYxOUFCMTFFQkE5RkE5NDVDMUU1NTJCMzAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkY0NjY1OUQxOTI2MTFFQjkzMUVDNEU3NzlBODlGQjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkY0NjY1OUUxOTI2MTFFQjkzMUVDNEU3NzlBODlGQjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5X3TQSAAAV1klEQVR42uxd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";
    this.logoutPath = ApplicationPaths.LogOut;
    this.loginPath = ApplicationPaths.Login;

  }

  mapMenuDataToPrimeMenu(menu: MenuData):MenuItem{

    let childMenu: MenuItem[] = [];
    if (menu.childMenus!==undefined){
      childMenu = menu.childMenus.map(md => this.mapMenuDataToPrimeMenu(md)).filter(x => x.visible);
    }
    return {
      label: menu.label,
      icon: menu.icon,
      //routerLink: menu.routerLink,
      //queryParams: menu.queryParams,
      state: menu,
      items: childMenu.length>0 ? childMenu : undefined,
      visible: menu.isVisible,
      command: (e)=>{
        console.log("handle menu");
        const menu: MenuItem = e.item;
        if (menu.items === undefined){
          this.handleMenuClick(menu.state, menu.state!.routerLink, menu.state!.queryParams);
        }
      }
    };
  }

  authenticationChanged(status: boolean): void {

    this.menuData = JSON.parse(JSON.stringify(this.config.menus));

    if (this.menuData === undefined || this.menuData === null) {
      console.debug("Application Menus not defined");
    }else{
      this.recurseMapMenu(this.menuData);
    }

      if (status){

        this.items = this.menuData.map(md => this.mapMenuDataToPrimeMenu(md)).filter(x => x.visible);

        this.userMenus = [
          {label: 'Manage', icon: 'pi pi-user', url: '/Identity/Account/Manage' },
          {label: 'Sign Out', icon: 'pi pi-sign-out', routerLink: this.logoutPath, state: { local: true } },
        ];
      }else{
        this.items = [];
        this.userMenus = [
          {label: 'Sign In', icon: 'pi pi-sign-in', routerLink: this.loginPath, state: { local: true } },
        ];
      }
  }

}

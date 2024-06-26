import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuData } from 'bq-start-core';
import { MainRegionAdapterService } from '../../services/mainRegionAdapter.service';
import { BaseComponent } from '../base.component';
import { AppInjector } from '../../services/app-injector.service';


export class BaseMenu extends BaseComponent {

  constructor(protected router: Router, protected regionSvc: MainRegionAdapterService){
    super();
  }

  protected recurseMapMenu(menus: MenuData[]){
    if (menus === undefined || menus === null){
      return;
    }
    menus.forEach(aMenu => {
      aMenu.routerLink = this.getPath(aMenu);
      aMenu.queryParams = this.getParams(aMenu);
      aMenu.isVisible = true;
      if (!(aMenu.allowedRoles === undefined || menus === null)){
        aMenu.isVisible = this.isInRole(aMenu.allowedRoles);
      }
      if (aMenu.childMenus){
        this.recurseMapMenu(aMenu.childMenus);
      }
    });
  }


  getPath(menuDef: MenuData) {
    if (menuDef.viewId != null) {
      const path = this.appInitService.runningConfig.getPathByViewId(menuDef.viewId);
      return path;
    } else {
      return menuDef.path;
    }
  }

  getParams(menuDef: MenuData) {
    if (menuDef.viewId != null) {
      return (menuDef.additionalQueryParam ?? {});
    } else {
      return {};
    }
  }

  async handleMenuClick(menu:any, link:string, queryParams: any) {
    if (this.config.tabbedUserInterface){
      if (menu.viewId){
        this.regionSvc.addToView(menu.viewId, "list", null, menu.icon);
      }else if (menu.component){
        this.regionSvc.addGenericComponentToView(menu.label, menu.component, menu.icon);
      }else if (menu.componentFactory){
        const dynCom = await menu.componentFactory(AppInjector.getInjector());
        this.regionSvc.addGenericComponentToView(menu.label, dynCom, menu.icon);
      }
    }else{
      this.router.navigate([link],{queryParams: queryParams});
    }
  }
}

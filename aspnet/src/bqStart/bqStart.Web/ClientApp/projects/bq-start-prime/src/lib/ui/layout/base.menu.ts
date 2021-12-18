import { Component, Input, OnInit } from '@angular/core';
import { MenuData } from '../../config/bq-start-config';
import { BaseComponent } from '../base.component';


export class BaseMenu extends BaseComponent {


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

}

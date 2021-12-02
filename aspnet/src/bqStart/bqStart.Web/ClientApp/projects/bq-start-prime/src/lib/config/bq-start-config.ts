import { InjectionToken, Type } from '@angular/core';
import { Dictionary } from '../models/meta-data';

export class BQConfigData {
  logoUrl: string;
  applicationName: string;
  companyName: string;
  menus: MenuData[];
  views: ViewData[];
  viewDefaults?: {
    defaultPageSize: number,
    otherPageSizes: number[]
  };
}

export class RunningConfigHelper {

  logoUrl: string;
  applicationName: string;
  companyName: string;
  menus: MenuData[];
  views: ViewData[];
  viewsById: Dictionary<ViewData>;
  formViewsByType: Dictionary<ViewData[]>;
  listViewsByType: Dictionary<ViewData[]>;
  viewDefaults?: {
    defaultPageSize: number,
    otherPageSizes: number[]
  } = { defaultPageSize: 50, otherPageSizes:[25,50,100] };

  constructor(config: BQConfigData) {
    this.logoUrl = config.logoUrl;
    this.applicationName = config.applicationName;
    this.companyName = config.companyName;
    this.menus = config.menus;
    this.views = config.views;
    this.viewsById = {};
    this.formViewsByType = {};
    this.listViewsByType = {};
    if (config.viewDefaults)
      this.viewDefaults = { ...config.viewDefaults };
    if (config.views != null && config.views.length > 0) {
      config.views.forEach(x => {
        this.viewsById[x.viewId] = x;
        if (x.viewType == ViewType.Form) {
          if (this.formViewsByType[x.typeName] == null) {
            this.formViewsByType[x.typeName] = [];
          }
          this.formViewsByType[x.typeName].push(x);
        }
        if (x.viewType == ViewType.List) {
          if (this.listViewsByType[x.typeName] == null) {
            this.listViewsByType[x.typeName] = [];
          }
          this.listViewsByType[x.typeName].push(x);
        }
      });
    }
  }

  getPathByViewId(viewId: string) {
    if (this.viewsById != null) {
      const viewData = this.viewsById[viewId];
      if (viewData != null) {
        if (viewData.viewType === ViewType.List) {
          return `view/${viewData.viewId}/list`;
        } else {
          return `view/${viewData.viewId}/form/-1`;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

}

export interface MenuData {
  label: string;
  icon: string;
  path?: string;
  allowedRoles?: string[];
  badgeEventTopic?: string;
  childMenus: MenuData[];
  isExpanded?: boolean;
  viewId?: string;
  additionalQueryParam?: any;
  routerLink?: string;
  queryParams?: object;
  isVisible?: boolean;
}

export interface ViewData {
  viewId: string;
  typeName: string;
  title: string;
  viewType: ViewType;
  component: Type<any>;
  hideBreadCrumb?: boolean;
}

export enum ViewType {
  List,
  Form
}

export enum FormType {
  List,
  New,
  Edit,
  Details
}

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const BQAdminConfigService = new InjectionToken<BQConfigData>("BQAdminConfig");

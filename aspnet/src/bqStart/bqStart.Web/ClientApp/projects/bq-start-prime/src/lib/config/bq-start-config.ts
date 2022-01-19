import { InjectionToken, Type } from '@angular/core';
import { Dictionary, ModelMetadata } from '../models/meta-data';

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
  /**
   * this option allows you to switch between router based or Multi Document Tabbed user interface in the main
   * view area. With tabbed interface any view will be open as tabs inside the main view and will not use angular router
   * links for navigation. Mainly useful for desktop/electron apps or enterprise apps.
   *
   * @type {boolean}
   * @memberof BQConfigData
   */
  tabbedUserInterface: boolean;
}

export class RunningConfigHelper {

  logoUrl: string;
  applicationName: string;
  companyName: string;
  menus: MenuData[];
  views: ViewData[];
  viewRoutes: any[];
  viewsById: Dictionary<ViewData>;
  formViewsByType: Dictionary<ViewData[]>;
  listViewsByType: Dictionary<ViewData[]>;
  tabbedUserInterface: boolean;
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
    this.tabbedUserInterface = config.tabbedUserInterface;
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
  /**
   * If this Menu will display a generic Component in Tabbed MDI View.
   *
   * @type {*}
   * @memberof MenuData
   */
  component?: Type<any>;
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

export class RouteData {
  viewDef: ViewData;
  formType: FormType;
  metaData: ModelMetadata;
  isModel: boolean = false;
  key: any;
  instance?: any;
  constructor() {
  }
}


/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const BQConfigService = new InjectionToken<BQConfigData>("BQConfig");

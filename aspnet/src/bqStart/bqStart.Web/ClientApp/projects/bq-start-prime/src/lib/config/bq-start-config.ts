import { InjectionToken, Type } from '@angular/core';
import { Dictionary, ModelMetadata } from '../models/meta-data';

/**
 * The startup class which will hold all the configuration details for
 * this Application
 *
 * @export
 * @class BQConfigData
 */
export class BQConfigData {
  /**
   * Logo URL of the App to display in Header
   *
   * @type {string}
   * @memberof BQConfigData
   */
  logoUrl: string;
  /**
   * The name of the application
   *
   * @type {string}
   * @memberof BQConfigData
   */
  applicationName: string;
  /**
   * Company Name used in Footer
   *
   * @type {string}
   * @memberof BQConfigData
   */
  companyName: string;
  /**
   * Menus to Display
   *
   * @type {MenuData[]}
   * @memberof BQConfigData
   */
  menus: MenuData[];
  /**
   * Display optional buttons on top right header menu bar next to Users menu
   *
   * @type {TopRightMenuData[]}
   * @memberof BQConfigData
   */
  topRightMenus?: TopRightMenuData[];
  /**
   * Display optional user menus under Top Right User icon instead of default menus
   *
   * @type {CustomUserMenus[]}
   * @memberof BQConfigData
   */
  userMenus?: CustomUserMenus[];
  /**
   * List of Views the application will have
   *
   * @type {ViewData[]}
   * @memberof BQConfigData
   */
  views: ViewData[];
  /**
   * Default View Data like page size
   *
   * @type {{
   *     defaultPageSize: number,
   *     otherPageSizes: number[]
   *   }}
   * @memberof BQConfigData
   */
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

  /**
   * Specify OAuth Configuration Details Here. For SPA templates where BQStart backend is running on the same location
   * do not need to set anything up as details can be found out from the server. If your STS server is running somewhere else
   * or the app is running in a Deskto Electron environment you can specify the Server Urls here.
   *
   * @type {OAuthConfig}
   * @memberof BQConfigData
   */
  oAuthConfig?: OAuthConfig;

  /**
   * Root API URL for the backend. If undefined then current base url is assumed.
   *
   * @type {string}
   * @memberof BQConfigData
   */
  apiRootUrl?: string;
}

/**
 * Runtime Configuration Class to hold various config data and helpers
 *
 * @export
 * @class RunningConfigHelper
 */
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
/**
 * Define a Menu Item to display in the app
 *
 * @export
 * @interface MenuData
 */
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

/**
 * Define a Menu Item to display in the app
 *
 * @export
 * @interface TopRightMenuData
 */
export interface TopRightMenuData {
  icon: string;
  buttonClass: string;
  eventName: string;
  title?: string;
}
/**
 * Define a Custom Menu Item to display under Top Right User Menu
 *
 * @export
 * @interface CustomUserMenus
 */

export interface CustomUserMenus {
  label: string;
  icon: string;
  url?: string;
  target?: string;
  eventName: string;
}

/**
 * Define a view, i.e. metadata of the view
 *
 * @export
 * @interface ViewData
 */
export interface ViewData {
  /**
   * Should be a unique Id
   *
   * @type {string}
   * @memberof ViewData
   */
  viewId: string;
  /**
   * The Entity Type from the Server which will constitute this View Data
   *
   * @type {string}
   * @memberof ViewData
   */
  typeName: string;
  /**
   * Title/Label of the View
   *
   * @type {string}
   * @memberof ViewData
   */
  title: string;
  /**
   * Is this a List or Detail Form view
   *
   * @type {ViewType}
   * @memberof ViewData
   */
  viewType: ViewType;
  /**
   * The component that is resposible for this View Display
   *
   * @type {Type<any>}
   * @memberof ViewData
   */
  component: Type<any>;
  /**
   * Do not show breadcrumb for this view in normal navigation mode
   *
   * @type {boolean}
   * @memberof ViewData
   */
  hideBreadCrumb?: boolean;
}

/**
 * BQ Form can be either List or Form/Details View
 *
 * @export
 * @enum {number}
 */
export enum ViewType {
  List,
  Form
}

/**
 * Type of Form view
 *
 * @export
 * @enum {number}
 */
export enum FormType {
  List,
  New,
  Edit,
  Details
}

/**
 * Internal Route Data in Runtime
 *
 * @export
 * @class RouteData
 */
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
 * OAuth Configuration Options for the app

 * @export
 * @class OAuthConfig
 */
export class OAuthConfig{
  /**
   * The Authority Url of the Server
   * @type {string}
   * @memberof OAuthConfig
   */
  authority: string;
  /**
   * Client id
   *
   * @type {string}
   * @memberof OAuthConfig
   */
  client_id: string;
  /**
   * Redirect URL to handle to post login. This should be approved in the Server.
   *
   * @type {string}
   * @memberof OAuthConfig
   */
   redirect_uri: string;
  /**
   * Post Logout URL
   *
   * @type {string}
   * @memberof OAuthConfig
   */
   post_logout_redirect_uri: string;
  /**
   * Response Type to get. Typically "code"
   *
   * @type {string}
   * @memberof OAuthConfig
   */
   response_type: string;
  /**
   * Scope to get from the Identity/STS server
   *
   * @type {string}
   * @memberof OAuthConfig
   */
  scope: string;
  /**
   * Should refresh token be used, it will automatically renew tokens
   *
   * @type {boolean}
   * @memberof OAuthConfig
   */
  automaticSilentRenew: boolean;
  /**
   * Send Id Token while performing auto renew
   *
   * @type {boolean}
   * @memberof OAuthConfig
   */
  includeIdTokenInSilentRenew: boolean;
}

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const BQConfigService = new InjectionToken<BQConfigData>("BQConfig");

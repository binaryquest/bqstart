import { Injectable, Injector } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, Routes } from "@angular/router";
import { ApplicationPaths } from "../api-authorization/api-authorization.constants";
import { AuthorizeGuard } from "../api-authorization/authorize.guard";
import { LoginComponent } from "../api-authorization/login/login.component";
import { LogoutComponent } from "../api-authorization/logout/logout.component";
import { BQConfigData, BQConfigService, FormType, RunningConfigHelper, ViewData, ViewType, RouteData } from "bq-start-core";
import { InternalLogService, LogPublishersService } from "./log/log.service";
import { MetaDataResolver } from "./meta-data.resolver";
import { DynamicLoaderComponent } from "../ui/core/dynamic.component";

const routes: Routes = [
  { path: ApplicationPaths.Register, component: LoginComponent },
  { path: ApplicationPaths.Profile, component: LoginComponent },
  { path: ApplicationPaths.Login, component: LoginComponent },
  { path: ApplicationPaths.LoginFailed, component: LoginComponent },
  { path: ApplicationPaths.LoginCallback, component: LoginComponent },
  { path: ApplicationPaths.LogOut, component: LogoutComponent },
  { path: ApplicationPaths.LoggedOut, component: LogoutComponent },
  { path: ApplicationPaths.LogOutCallback, component: LogoutComponent }
];

/**
 * Bootstrap Service for setting up the bqStart application
 *
 * @export
 * @class AppInitService
 */
@Injectable()
export class AppInitService {

  private _config: BQConfigData;
  private _runningConfig: RunningConfigHelper;

  get config(): BQConfigData {
    return this._config;
  }

  get runningConfig(): RunningConfigHelper {
    return this._runningConfig;
  }

  tabbedMDIRoutes:any[];

  constructor(private injector: Injector, private router: Router, private pageTitle: Title, private logSvc:LogPublishersService) {
    this._config = this.injector.get(BQConfigService);
    this._runningConfig = new RunningConfigHelper(this._config);
  }

  Init() {

    this.pageTitle.setTitle(this.config.applicationName);

    return new Promise<void>((resolve, reject) => {

      let viewRoutes : any[] = [];
      for (let i = 0; i < this.config.views.length; i++) {
        const viewDef = this.config.views[i];
        if (viewDef.viewType === ViewType.Custom){
          const newRoute = {
            path: `${viewDef.viewId}`,
            component: DynamicLoaderComponent,
            data: { viewDef: viewDef, componentType: viewDef.component, componentFactory: viewDef.componentFactory },
            canActivate: [AuthorizeGuard]
          };
          viewRoutes.push(newRoute);
        }
        if (viewDef.viewType === ViewType.List){
          const newRoute = {
            path: `view/${viewDef.viewId}/list`,
            component: DynamicLoaderComponent,
            data: { viewDef: viewDef, formType: FormType.List, componentType: viewDef.component, componentFactory: viewDef.componentFactory },
            resolve: { metaData: MetaDataResolver },
            canActivate: [AuthorizeGuard]
          };
          viewRoutes.push(newRoute);
        }else{
          const newRoute = {
            path: `view/${viewDef.viewId}/form/:keys`,
            component: DynamicLoaderComponent,
            data: { viewDef: viewDef, formType: FormType.Details, componentType: viewDef.component, componentFactory: viewDef.componentFactory },
            resolve: { metaData: MetaDataResolver },
            canActivate: [AuthorizeGuard]
          };
          viewRoutes.push(newRoute);
          const newRouteEdit = {
            path: `view/${viewDef.viewId}/edit/:keys`,
            component: DynamicLoaderComponent,
            data: { viewDef: viewDef, formType: FormType.Edit, componentType: viewDef.component, componentFactory: viewDef.componentFactory },
            resolve: { metaData: MetaDataResolver },
            canActivate: [AuthorizeGuard]
          };
          viewRoutes.push(newRouteEdit);
          const newRouteAdd = {
            path: `view/${viewDef.viewId}/add/-1`,
            component: DynamicLoaderComponent,
            data: { viewDef: viewDef, formType: FormType.New, componentType: viewDef.component, componentFactory: viewDef.componentFactory },
            resolve: { metaData: MetaDataResolver },
            canActivate: [AuthorizeGuard]
          };
          viewRoutes.push(newRouteAdd);
        }
      }

      this._runningConfig.viewRoutes = viewRoutes;

      if (this.config.tabbedUserInterface){
        viewRoutes = this.tabbedMDIRoutes;
      }

      setTimeout(() => {
        const newRoutes = [...this.router.config, ...routes, ...viewRoutes];
        this.router.resetConfig(newRoutes);

        InternalLogService.logger().info("🛠️ BqStart Initialized 🛠️");

        resolve();
      }, 500);

    });
  }
}

export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  }
}

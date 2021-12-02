import { Injectable, Injector } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, Routes } from "@angular/router";
import { ApplicationPaths } from "../api-authorization/api-authorization.constants";
import { LoginComponent } from "../api-authorization/login/login.component";
import { LogoutComponent } from "../api-authorization/logout/logout.component";
import { BQConfigData, BQAdminConfigService, FormType, RunningConfigHelper, ViewData, ViewType } from "../config/bq-start-config";
import { InternalLogService, LogPublishersService } from "./log/log.service";
import { MetaDataResolver } from "./meta-data.resolver";

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

export class RouteData{
  viewDef: ViewData;
  formType: FormType;

  constructor() {

  }
}

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

  constructor(private injector: Injector, private router: Router, private pageTitle: Title, private logSvc:LogPublishersService) {
    this._config = this.injector.get(BQAdminConfigService);
    this._runningConfig = new RunningConfigHelper(this._config);
  }

  Init() {

    this.pageTitle.setTitle(this.config.applicationName);

    return new Promise<void>((resolve, reject) => {

      let viewRoutes : any[] = [];
      for (let i = 0; i < this.config.views.length; i++) {
        const viewDef = this.config.views[i];
        if (viewDef.viewType === ViewType.List){
          const newRoute = {
            path: `view/${viewDef.viewId}/list`,
            component: viewDef.component, data: { viewDef: viewDef, formType: FormType.List },
            resolve: { metaData: MetaDataResolver }
          };
          viewRoutes.push(newRoute);
        }else{
          const newRoute = {
            path: `view/${viewDef.viewId}/form/:keys`,
            component: viewDef.component, data: { viewDef: viewDef, formType: FormType.Details },
            resolve: { metaData: MetaDataResolver }
          };
          viewRoutes.push(newRoute);
          const newRouteEdit = {
            path: `view/${viewDef.viewId}/edit/:keys`,
            component: viewDef.component, data: { viewDef: viewDef, formType: FormType.Edit },
            resolve: { metaData: MetaDataResolver }
          };
          viewRoutes.push(newRouteEdit);
          const newRouteAdd = {
            path: `view/${viewDef.viewId}/add/-1`,
            component: viewDef.component, data: { viewDef: viewDef, formType: FormType.New },
            resolve: { metaData: MetaDataResolver }
          };
          viewRoutes.push(newRouteAdd);
        }
      }

      setTimeout(() => {
        const newRoutes = [...this.router.config, ...routes, ...viewRoutes];
        this.router.resetConfig(newRoutes);

        InternalLogService.logger().info("🛠️ BqAdmin Initialized 🛠️");

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

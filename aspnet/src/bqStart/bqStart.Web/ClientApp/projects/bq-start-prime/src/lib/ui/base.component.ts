import { Component, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthorizeService, IUser } from "../api-authorization/authorize.service";
import { BQConfigData, BQConfigService } from "../config/bq-start-config";
import { AppInitService } from "../services/app-init.service";
import { AppInjector } from "../services/app-injector.service";
import { DialogService } from "../services/dialog.service";
import { LocaleService } from "../services/locale.service";
import { InternalLogService, LogService } from "../services/log/log.service";
import { MessageService, MessageType } from "../services/message.service";
import { NavigationService } from "../services/navigation.service";


@Component({
  template: ''
})
export class BaseComponent {

  config: BQConfigData;
  authorizeService: AuthorizeService;
  appInitService:AppInitService;
  messageSvc: MessageService;
  logger: LogService;
  user: IUser | null;
  isAuthenticated: boolean;
  injector: Injector;
  isLoading: boolean = false;
  navigationService: NavigationService;
  dialogService: DialogService;
  localeService: LocaleService;
  translate: TranslateService;

  constructor() {
    this.injector = AppInjector.getInjector();
    this.config = this.injector.get(BQConfigService);
    this.appInitService = this.injector.get(AppInitService);
    this.authorizeService = this.injector.get(AuthorizeService);
    this.messageSvc = this.injector.get(MessageService);
    this.logger = this.injector.get(LogService);
    this.authorizeService.getUser().subscribe(x => this.user = x);
    this.authorizeService.isAuthenticated().subscribe(x => this.isAuthenticated = x);
    this.navigationService = this.injector.get(NavigationService);
    this.dialogService = this.injector.get(DialogService);
    this.localeService = this.injector.get(LocaleService);
    this.translate = this.injector.get(TranslateService);
  }

  isInRole(role: string[]): boolean {

    if (role===undefined || role===null){
      return true;
    }
    if (role.length===0){
      return true;
    }

    if (!this.isAuthenticated)
      return false;
    if (this.user !== null && this.user !== undefined && this.user?.role !== null) {
      if (Array.isArray(this.user?.role)) {
        for (let index = 0; index < this.user.role.length; index++) {
          const userRole = this.user?.role[index];
          if (userRole!=null && role.includes(userRole)){
            return true;
          }
        }
      }
      else if (this.user !== null && this.user.role !== undefined && role.includes(this.user.role)) {
        return true;
      }
    }
    return false;
  }

  showError(message: string) {
    this.messageSvc.showMessage(message, "Error", MessageType.error);
  }

  showWarning(message: string) {
    this.messageSvc.showMessage(message, "Warning", MessageType.warn);
  }

  showSuccess(message: string) {
    this.messageSvc.showMessage(message, "Success", MessageType.success);
  }

  showInfo(message: string) {
    this.messageSvc.showMessage(message, "Info", MessageType.info);
  }

  errHandler(error:any) {
    console.log("errHandler");
    setTimeout(() => this.isLoading = false, 100);
    let msg = "";
    if (error) {
      if (error.error) {
        if (error.error.error){
          msg = error.error.error.message ?? error.error.error;
        }
        else if (error.error.value){
          msg = error.error.value;
        }
        else
          msg = error.error;
      } else if (error.message) {
        msg = error.message;
      } else {
        msg = String(error);
      }
    }
    this.messageSvc.showMessage(msg, this.i18("bq-start.messages.error"), MessageType.error);
  };

  i18(key:string){
    return this.translate.instant(key);
  }
}

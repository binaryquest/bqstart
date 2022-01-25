import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from '../api-authorization/authorize.service';
import { BQConfigData, BQConfigService, FormType, MenuData, ViewData, RouteData, ViewType } from '../config/bq-start-config';
import { AppInjector } from './app-injector.service';
import { LogService } from './log/log.service';
import { MessageService } from './message.service';
import { MetaDataService } from './meta-data.service';
import { ApplicationPaths, QueryParameterNames } from '../api-authorization/api-authorization.constants';

/**
 * This class is responsible for maintaining the MDI interface within the main view.
 * Borrowed from the idea of PRISM Region Adpaters in WPF
 * @export
 * @class MainRegionAdapterService
 */
@Injectable({providedIn: 'root'})
export class MainRegionAdapterService {

  injector: any;
  config: BQConfigData;
  currentStack:ViewRunningData[];
  activeIndex: number = 0;
  logger: LogService;
  messageSvc: MessageService;
  authorizeService: AuthorizeService;
  isAuthenticated: boolean;

  constructor(private router:Router, private metaDataService: MetaDataService) {
    this.injector = AppInjector.getInjector();
    this.config = this.injector.get(BQConfigService);
    this.authorizeService = this.injector.get(AuthorizeService);
    this.messageSvc = this.injector.get(MessageService);
    this.logger = this.injector.get(LogService);
    this.authorizeService.isAuthenticated().subscribe(x => {
      this.isAuthenticated = x;
    });
    this.currentStack = [];
  }

  addToView(viewId:string, viewType:string, key:any, icon: string){
    console.log("addToView called");
    if (this.isAuthenticated){
      const view = this.config.views.find(x => x.viewId === viewId);
      // let path = `view/${viewId}/${viewType}/${key}`;
      // if (key === undefined || key === null){
      //   path = `view/${viewId}/${viewType}`;
      // }
      if (view !== undefined) {
        const typeName = view.typeName;
        //const viewRoute = this.appInitService.runningConfig.viewRoutes.find(x => x.path === path);
        let formType: FormType = FormType.List;
        switch (viewType) {
          case "list":
            formType = FormType.List;
            break;
          case "add":
              formType = FormType.New;
              break;
          case "form":
            formType = FormType.Details;
            break;
          case "edit":
            formType = FormType.Edit;
            break;
          default:
            break;
        }

        //check if the view is already open or not,
        //if open then check if we can ask that view like in prism
        for (let index = 0; index < this.currentStack.length; index++) {
          const ov = this.currentStack[index];
          if (ov.viewDef.viewId === viewId && ov.routeData.instance && ov.routeData.formType === formType){
            try {
              const ret = ov.routeData.instance.canOpen(key);
              if (!ret){
                this.activeIndex = index;
                return;
              }
            } catch (error) {}
          }
        }

        this.metaDataService.getTypeMetaData(typeName).subscribe(x => {
          const routeData = new RouteData();
          routeData.formType = formType;
          routeData.key = key;
          routeData.metaData = x;
          routeData.viewDef = view;
          this.currentStack.push({viewDef: view, routeData: routeData, icon: icon});
          if (this.currentStack.length>1){
            this.activeIndex = this.currentStack.length - 1;
          }
        });
      }
    }else{
      this.router.navigate(ApplicationPaths.LoginPathComponents, {
        queryParams: {
          [QueryParameterNames.ReturnUrl]: '/'
        }
      });
    }
  }

  removeFromView(index:number){
    if (index>-1){

      const ov = this.currentStack[index];
      try {
        if (ov.routeData.instance){
          const ret = ov.routeData.instance.canClose();
          if (!ret){
            return;
          }
        }
      } catch (error) {}

      this.currentStack.splice(index, 1);
      if (this.currentStack.length>1){
        this.activeIndex = this.currentStack.length - 1;
      }else{
        this.activeIndex = 0;
      }
    }
  }

  removeCurrentView(skipCanClose:boolean = false){
    if (!skipCanClose){
      this.removeFromView(this.activeIndex);
    }else{
      this.currentStack.splice(this.activeIndex, 1);
      if (this.currentStack.length>1){
        this.activeIndex = this.currentStack.length - 1;
      }else{
        this.activeIndex = 0;
      }
    }
  }

  addGenericComponentToView(menuTitle: string, component: any, icon: string){

    //check if the view is already open or not,
    for (let index = 0; index < this.currentStack.length; index++) {
      const ov = this.currentStack[index];
      if (ov.viewDef.viewId === menuTitle && ov.routeData.instance){
        this.activeIndex = index;
        return;
      }
    }

    const routeData = new RouteData();
    routeData.formType = FormType.Details;
    routeData.viewDef = {component: component, viewId: menuTitle, title:menuTitle, viewType:ViewType.Form, typeName: menuTitle};
    this.currentStack.push({viewDef: routeData.viewDef, routeData: routeData, icon: icon});
    if (this.currentStack.length>1){
      this.activeIndex = this.currentStack.length - 1;
    }
  }

}

export class ViewRunningData{
  viewDef: ViewData;
  routeData: RouteData;
  icon: string;
}

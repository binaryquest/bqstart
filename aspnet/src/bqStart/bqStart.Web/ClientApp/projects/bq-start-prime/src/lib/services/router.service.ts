import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormType, ViewData, RouteData } from '../config/bq-start-config';
import { ModelMetadata } from '../models/meta-data';
import { MainRegionAdapterService } from './mainRegionAdapter.service';

/**
 * Router Wrapper Service to encapsulate between router and mdi interface views
 *
 * @export
 * @class RouterService
 */
@Injectable()
export class RouterService {

  metaData: ModelMetadata;
  viewDef: ViewData;
  formType: FormType;
  isModal: boolean;
  queryParams: BehaviorSubject<Params|null> = new BehaviorSubject<Params|null>(null);
  primaryKeyValues: BehaviorSubject<any|null> = new BehaviorSubject<any|null>(null);
  private internalParams: Params = {};


  constructor(protected route: ActivatedRoute, protected router: Router, protected regionSvc:MainRegionAdapterService, @Optional() protected routeData?: RouteData) {

    if (routeData === undefined){
      this.metaData = route.snapshot.data.metaData;
      this.viewDef = route.snapshot.data.viewDef;
      this.formType = route.snapshot.data.formType;
      this.isModal = false;
      this.route.queryParams.subscribe(params => {
        this.queryParams.next(params);
      });
      this.route.paramMap.pipe(map(param => {
        if (param.has('keys')){
          return this.metaData.parseRouteParamToKeys(param.get('keys'));
        }else{
          return [];
        }
      })).subscribe(primaryKeyValues => {
        this.primaryKeyValues.next(primaryKeyValues);
      });
    } else if (routeData !== undefined){
      //console.log(routeData);
      this.metaData = routeData!.metaData;
      this.viewDef = routeData!.viewDef;
      this.formType = routeData!.formType;
      this.isModal = routeData!.isModel;
      if (routeData?.key){
        //console.log("next key is " + routeData?.key);
        this.primaryKeyValues.next(routeData.key);
      }
      this.queryParams.next(this.internalParams);
    }else{
      //console.log("route data is null");
    }

  }

  tableNavigate(queryParams: any){
    if (this.routeData !== undefined){
      this.internalParams = {...this.internalParams, ...queryParams};
      this.queryParams.next(this.internalParams);
    } else {
      this.router.navigate([],
        {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: 'merge'
        }
      );
    }
  }

  /**
   * Navigate to a given URL. If inside MDI layout then it will open that route inside a tab window
   *
   * @param {string} viewId
   * @param {string} viewType
   * @param {*} key
   * @param {*} [options={}]
   * @memberof RouterService
   */
  navigateToView(viewId:string, viewType:string, key:any, options: any = {}){

    if (this.routeData !== undefined){
      this.regionSvc.addToView(viewId, viewType, this.metaData.parseRouteParamToKeys(key), "");
    }else{
      const path = `view/${viewId}/${viewType}/${key}`;
      this.router.navigate([path], options);
    }
  }
}

import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormType, ViewData } from '../config/bq-start-config';
import { ModelMetadata } from '../models/meta-data';
import { RouteData } from './app-init.service';

/**
 *
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


  constructor(protected route: ActivatedRoute, protected router: Router, @Inject('routeData') @Optional() protected routeData?: RouteData) {

    console.log("router service init");

    if (route.snapshot.data !== null){
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
    } else if (routeData !== null){
      this.metaData = routeData!.metaData;
      this.viewDef = routeData!.viewDef;
      this.formType = routeData!.formType;
      this.isModal = routeData!.isModel;
      this.queryParams.next(this.internalParams);
      if (routeData?.key){
        this.primaryKeyValues.next(routeData.key);
      }
    }

  }

  tableNavigate(queryParams: any){
    if (this.routeData !== null){
      console.debug("TODO: update internal queryMap");
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

  navigateToView(viewId:string, key:any){
    if (this.routeData !== null){
      console.debug("TODO: open new dialog");
    }else{
      const path = `view/${viewId}/form/${key}`;
      this.router.navigate([path], { queryParamsHandling: 'merge' });
    }
  }
}

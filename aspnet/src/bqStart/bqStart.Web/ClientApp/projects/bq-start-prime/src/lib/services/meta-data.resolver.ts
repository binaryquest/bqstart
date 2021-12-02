import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ModelMetadata } from '../models/meta-data';
import { MetaDataService } from './meta-data.service';



@Injectable({
  providedIn: 'root'
})
export class MetaDataResolver implements Resolve<ModelMetadata> {
  constructor(private metaDataService: MetaDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    if (route.data.viewDef === undefined){
      throw new Error('Route missing viewData');
    }
    const typeName = route.data.viewDef.typeName;
    return this.metaDataService.getTypeMetaData(typeName);
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MetaDataService } from './meta-data.service';


/**
 * To load type related metadata from backend
 *
 * @export
 * @class MetaDataResolver
 * @implements {Resolve<ModelMetadata>}
 */
@Injectable({
  providedIn: 'root'
})
export class MetaDataResolver  {
  constructor(private metaDataService: MetaDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    if (route.data['viewDef'] === undefined){
      throw new Error('Route missing viewData');
    }
    const typeName = route.data['viewDef'].typeName;
    if (typeName.startsWith("~~")) //dummy types
      return Promise.resolve();
    return this.metaDataService.getTypeMetaData(typeName);
  }
}

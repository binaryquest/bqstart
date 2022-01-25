import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BQConfigData, BQConfigService } from "../config/bq-start-config";
import { ModelMetadata } from "../models/meta-data";

/**
 * Responsible for fetching entity metadata from backend
 *
 * @export
 * @class MetaDataService
 */
@Injectable()
export class MetaDataService{

  rootUrl: string = "";

  constructor(private http: HttpClient, @Inject(BQConfigService) private config:BQConfigData){
    if (config.apiRootUrl !== undefined){
      this.rootUrl = config.apiRootUrl;
      this.rootUrl = this.rootUrl.endsWith('/') ? this.rootUrl.slice(0, -1) : this.rootUrl;
    }
  }

  getTypeMetaData(typeName:string): Observable<ModelMetadata>{

    const headers = new HttpHeaders().set('Content-Type','text/plain');

    const url = `${this.rootUrl}/odata/${typeName}/ModelMetaData`;
    return this.http.post(url, {}, {headers: headers}).pipe(
      map(m => ModelMetadata.fromObject(m))
    );
  }
}

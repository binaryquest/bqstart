import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ModelMetadata } from "../models/meta-data";

@Injectable()
export class MetaDataService{

  constructor(private http: HttpClient){
  }

  getTypeMetaData(typeName:string): Observable<ModelMetadata>{
    const url = `/odata/${typeName}/ModelMetaData`;
    return this.http.post(url, {}).pipe(
      map(m => ModelMetadata.fromObject(m))
    );
  }
}

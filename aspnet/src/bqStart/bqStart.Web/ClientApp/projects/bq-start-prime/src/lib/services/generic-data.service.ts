import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from "@angular/core";
import { Observable } from "rxjs";
import { FilterByClause, TableParams } from "../models/table-data";
import { ODataResponse } from "../models/odata-response";
import { map } from "rxjs/operators";
import { InternalLogService } from "./log/log.service";
import { ModelMetadata } from "../models/meta-data";
import { BQConfigData, BQConfigService } from "../config/bq-start-config";

export const DataServiceToken = new InjectionToken<DataServiceOptions>('GSvcDataOptions');
export declare class DataServiceOptions {
  $expandClause?: string;
  $selectClause?: string;
  $type: string;
}

/**
 * Generic Data Service to fetch data from backend controllers using OData notations
 *
 * @export
 * @class GenericDataService
 * @implements {OnDestroy}
 */
@Injectable(
  {
    providedIn: 'any'
  }
)
export class GenericDataService implements OnDestroy {

  private rootUrl: string = '';

  constructor(private http: HttpClient, @Inject(BQConfigService) private config:BQConfigData, @Inject(DataServiceToken) private options:DataServiceOptions) {
    InternalLogService.logger().debug(`Generic Data Svc Init`);
    if (!options){
      console.warn("options is undefined or null in GenericDataService");
    }
    this.rootUrl = config.apiRootUrl ?? '';
    this.rootUrl = this.rootUrl.endsWith('/') ? this.rootUrl.slice(0, -1) : this.rootUrl;
  }

  ngOnDestroy(): void {
  }

  /**
   * Fetch all Data for a Given Type
   *
   * @template T
   * @param {TableParams} tableParams
   * @return {*}  {Observable<ODataResponse<T>>}
   * @memberof GenericDataService
   */
  public getAll<T>(tableParams: TableParams): Observable<ODataResponse<T>> {

    if (tableParams === undefined || tableParams === null){
      throw new Error("tableParams is undefined or null");
    }

    let url = `${this.rootUrl}/odata/${this.options.$type}/?$count=true`;

    if (tableParams.top) {
        url = url + "&$top=" + tableParams.top;
    }
    if (tableParams.skip) {
        url = url + "&$skip=" + tableParams.skip;
    }
    if (tableParams.filterByCollection.length > 0) {
        var allfilters = "&$filter=";
        for (var i = 0; i < tableParams.filterByCollection.length; i++) {
            if (i > 0) {
                allfilters = allfilters + " and " + tableParams.filterByCollection[i].GetODataUrl();
            } else {
                allfilters = allfilters + tableParams.filterByCollection[i].GetODataUrl();
            }
        }
        url = url + allfilters;
    }
    if (tableParams.orderByCollection.length > 0) {
        var allOrderBy = "&$orderby=";
        for (var i = 0; i < tableParams.orderByCollection.length; i++) {
            if (i > 0) {
                allOrderBy = allOrderBy + "," + tableParams.orderByCollection[i].FieldName.replace(/\./g, '/');
            } else {
                allOrderBy = allOrderBy + tableParams.orderByCollection[i].FieldName.replace(/\./g, '/');
            }
            if (tableParams.orderByCollection[i].Dir == "desc") {
                allOrderBy = allOrderBy + " desc";
            }
        }
        url = url + allOrderBy;
    }

    if (this.options.$expandClause){
      url += `&$expand=${this.options.$expandClause}`;
    }
    if (this.options.$selectClause){
      url += `&$select=${this.options.$selectClause}`;
    }
    return this.http.get(url).pipe(map(x => new ODataResponse<T>(x)));
  }

  /**
   * Fetch a single instance of a data type
   *
   * @template T
   * @param {any[]} model
   * @param {ModelMetadata} metaData
   * @return {*}  {Observable<ODataResponse<T>>}
   * @memberof GenericDataService
   */
  public get<T>(model:any[], metaData:ModelMetadata): Observable<ODataResponse<T>> {

    let url = `${this.rootUrl}/odata/${this.options.$type}(${metaData.getPrimaryKeyAsUrl(model)})?`;

    if (this.options.$expandClause){
      url += `&$expand=${this.options.$expandClause}`;
    }
    if (this.options.$selectClause){
      url += `&$select=${this.options.$selectClause}`;
    }

    return this.http.get(url).pipe(map(x => new ODataResponse<T>(x)));
  }

  /**
   * Get Lookup/Dropdown records sources
   *
   * @template T
   * @param {ModelMetadata} metaData
   * @return {*}  {Observable<ODataResponse<T>>}
   * @memberof GenericDataService
   */
  public getLookupData<T>(metaData:ModelMetadata): Observable<ODataResponse<T>>{
    let url = `${this.rootUrl}/odata/${this.options.$type}/LookupData`;
    return this.http.post(url, {}).pipe(map(x => new ODataResponse<T>(x)));
  }

  /**
   * Save Data/record
   *
   * @template T
   * @param {T} model
   * @param {Boolean} isAdd
   * @return {*}  {Observable<ODataResponse<T>>}
   * @memberof GenericDataService
   */
  public save<T>(model:T, isAdd:Boolean): Observable<ODataResponse<T>>{
    let headers = new HttpHeaders();
    headers = headers.set('Prefer', 'return=representation');
    let url = `${this.rootUrl}/odata/${this.options.$type}`;
    if (isAdd){
      return this.http.patch(url, model, {headers: headers}).pipe(map(x => new ODataResponse<T>(x)));
    }else{
      return this.http.post(url, model, {headers: headers}).pipe(map(x => new ODataResponse<T>(x)));
    }
  }

  /**
   * Delete data/record
   *
   * @template T
   * @param {any[]} model
   * @param {ModelMetadata} metaData
   * @return {*}  {Observable<ODataResponse<T>>}
   * @memberof GenericDataService
   */
  public delete<T>(model:any[], metaData:ModelMetadata): Observable<ODataResponse<T>>{
    let headers = new HttpHeaders();
    headers = headers.set('Prefer', 'return=representation');
    let url = `${this.rootUrl}/odata/${this.options.$type}(${metaData.getPrimaryKeyAsUrl(model)})`;
    return this.http.delete(url, {headers: headers}).pipe(map(x => new ODataResponse<T>(x)));
  }
}

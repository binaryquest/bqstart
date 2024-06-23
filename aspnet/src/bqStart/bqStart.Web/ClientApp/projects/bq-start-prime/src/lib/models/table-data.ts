import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { AppInitService } from "../services/app-init.service";
import { RouterService } from "../services/router.service";
import { ALL_PREDICATES, MetadataField, Predicate, PREDICATE_BETWEEN, TypeSystem, TYPE_SYSTEM } from "bq-start-core";
import { ODataResponse } from "./odata-response";

/**
 * This class defines the table view runtime metadata information like filters and sort orders
 *
 * @export
 * @class TableParams
 */
export class TableParams {

  public top: number;
  public skip: number;
  public expand: string;
  public orderByCollection: Array<OrderByClause>;
  public filterByCollection: Array<FilterByClause>;
  public count: Subject<number> = new Subject<number>();

  private paramsChangedSubject: BehaviorSubject<TableParams | null> = new BehaviorSubject<TableParams | null>(null);
  private sub: any;
  private defaultPageSize: number = 50;

  constructor(private routerSvc: RouterService, private appSvc: AppInitService) {
    this.orderByCollection = [];
    this.filterByCollection = [];
    if (appSvc.runningConfig.viewDefaults?.defaultPageSize) {
      this.defaultPageSize = appSvc.runningConfig.viewDefaults?.defaultPageSize;
    }

    this.sub = this.routerSvc.queryParams.subscribe(params => {
      if (params!=null){
        if (params['top']) {
          this.top = +params['top']; //+ converts to number
        } else {
          this.top = this.defaultPageSize;
        }
        if (params['skip']) {
          const skip = +params['skip'];
          this.skip = skip;
        } else {
          this.skip = 0;
        }
        if (params['orderBy']) {
          this.orderByCollection = this.uriToJSON(params['orderBy']);;
        } else {
          this.orderByCollection = [];
        }
        this.filterByCollection = [];
        if (params['filter']) {
          const tempCollection = this.uriToJSON<FilterByClause[]>(params['filter']);
          tempCollection.forEach(jsonObj => {
            const filter = Object.assign(new FilterByClause(), jsonObj);
            this.filterByCollection.push(filter);
          });
        }
        this.paramsChangedSubject.next(this);
      }
    });
  }

  getChanges(): Observable<TableParams | null> {
    return this.paramsChangedSubject.asObservable();
  }

  gotoPage(param: { top?: number, skip?: number, orderBy?: OrderByClause | null }) {

    let orderByList = [];
    if (param.orderBy) {
      orderByList.push(param.orderBy);
    }

    const formattedQueryParam = { top: param.top, skip: param.skip, orderBy: this.jsonToURI(orderByList) };

    this.routerSvc.tableNavigate(formattedQueryParam);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: formattedQueryParam,
    //     queryParamsHandling: 'merge'
    //   }
    // );

  }

  destroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  serverDataLoaded<T>(data: ODataResponse<T>) {
    let count = 0;
    if (data.metadata.get('count')) {
      count = data.metadata.get('count');
    } else {
      count = data.entities ? data.entities.length : 0;
    }
    this.count.next(count);
  }

  clearFilters() {
    const formattedQueryParam = { top: this.defaultPageSize, skip: 0, filter: this.jsonToURI([]) };
    this.routerSvc.tableNavigate(formattedQueryParam);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: formattedQueryParam,
    //     queryParamsHandling: 'merge'
    //   }
    // );
  }

  addFilter(filter: FilterByClause) {
    if (filter) {
      this.filterByCollection.push(filter);
    }

    const formattedQueryParam = { top: this.defaultPageSize, skip: 0, filter: this.jsonToURI(this.filterByCollection) };
    this.routerSvc.tableNavigate(formattedQueryParam);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: formattedQueryParam,
    //     queryParamsHandling: 'merge'
    //   }
    // );
  }

  addFilters(filters: FilterByClause[]) {
    if (filters) {
      this.filterByCollection = this.filterByCollection.concat(filters);
    }

    const formattedQueryParam = { top: this.defaultPageSize, skip: 0, filter: this.jsonToURI(this.filterByCollection) };
    this.routerSvc.tableNavigate(formattedQueryParam);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: formattedQueryParam,
    //     queryParamsHandling: 'merge'
    //   }
    // );
  }

  removeFilter(filter: FilterByClause) {

    if (filter) {
      this.filterByCollection = this.filterByCollection.filter(f => f !== filter);
    }

    const formattedQueryParam = { top: this.defaultPageSize, skip: 0, filter: this.jsonToURI(this.filterByCollection) };
    this.routerSvc.tableNavigate(formattedQueryParam);
    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: formattedQueryParam,
    //     queryParamsHandling: 'merge'
    //   }
    // );
  }

  private jsonToURI(json: any) { return encodeURIComponent(JSON.stringify(json)); }

  private uriToJSON<T>(urijson: string): T { return JSON.parse(decodeURIComponent(urijson)); }

}


export class OrderByClause {
  public FieldName: string;
  public Caption: string;
  public Dir: string;
}

export class FilterByClause {
  public FieldName: string;
  public Caption: string;
  public Predicate: string;
  public Value: any;
  public DisplayValue: string | null;
  public CustomName: string;
  public DataType: string;
  public ToValue: any;
  public ToDisplayValue: string;

  public toString = (): string => {
    if (this.CustomName) {
      return this.CustomName;
    } else if (this.Predicate === PREDICATE_BETWEEN.key) {
      if (this.DataType == "DateTime"){
        return `${this.Caption} ${this.Predicate} ${this.DisplayValue ?? this.Value} and ${this.ToDisplayValue ?? this.ToValue}`;
      }else
        return `${this.Caption} ${this.Predicate} ${this.DisplayValue ?? this.Value} and ${this.ToDisplayValue ?? this.ToValue}`;
    } else {
      return `${this.Caption} ${this.Predicate} ${this.DisplayValue ?? this.Value}`;
    }
  }

  public IsValid() {
    if (!this.FieldName)
      return false;
    if (!this.Caption)
      return false;
    if (!this.DataType)
      return false;
    if (!this.Predicate)
      return false;
    if (this.Value === undefined || this.Value === null)
      return false;
    const pr:Predicate = ALL_PREDICATES[this.Predicate as keyof {}];
    if (!pr)
      return false;
    if (pr.hasSecondParam){
      if (this.ToValue === undefined || this.ToValue === null)
        return false;
    }
    return true;
  }

  public static GetDefault(caption: string, field: MetadataField): FilterByClause {
    const ret = new FilterByClause();
    ret.Caption = caption ?? field.caption;
    ret.FieldName = field.name;
    ret.Predicate = field.typeSystem.predicates[0].key;
    ret.Value = null;
    ret.DataType = field.dataType;
    ret.DisplayValue = null;
    return ret;
  }

  public GetODataUrl():string{
    const typeSystem:TypeSystem = TYPE_SYSTEM[this.DataType];
    const fieldName = this.FieldName;
    const value = typeSystem.escapeValue(this.Value);
    const toValue = typeSystem.escapeValue(this.ToValue);
    const predicate:Predicate = ALL_PREDICATES[this.Predicate as keyof {}];

    //console.log("GetODataUrl", value, this.ToValue);

    switch (predicate.key) {
      case 'contains': return `contains(${fieldName},${value})`;
      case 'not contains': return `not contains(${fieldName},${value})`;
      case 'starts': return `startsWith(${fieldName},${value}) eq true`;
      case 'ends':  return `endsWith(${fieldName},${value}) eq true`;
      case '=': return `${fieldName} eq ${value}`;
      case '>': return `${fieldName} gt ${value}`;
      case '<': return `${fieldName} lt ${value}`;
      case '>=': return `${fieldName} ge ${value}`;
      case '<=': return `${fieldName} le ${value}`;
      case 'between': return `${fieldName} ge ${value} AND ${fieldName} le ${toValue}`;
      case 'is set': return `${fieldName} ne null`;
      case 'is not set':  return `${fieldName} eq null`;
      default:
        break;
    }


    return "";
  }
}

export class PredefinedFilter {

  private _field: MetadataField;
  public get field(): MetadataField {
    return this._field;
  }

  private _caption: string;
  public get caption(): string {
    return this._caption;
  }

  private _value: any;
  public get value(): any {
    return this._value;
  }

  private _filterName: string;
  public get filterName(): string {
    return this._filterName;
  }

  private _predicate: Predicate;
  public get predicate(): Predicate {
    return this._predicate;
  }

  private _toValue: any;
  public get toValue(): any {
    return this._toValue;
  }

  isSelected:boolean;

  constructor(param:{field: MetadataField, caption?: string, value: any, filterName: string, predicate: string, toValue?: any}) {
    let predicateIndex = -1;

    if (param === undefined || param === null){
      throw new Error("Param not defined or null");
    }
    if (param.field === undefined || param.field === null){
      throw new Error("Param field not defined or null");
    }
    if (param.filterName === undefined || param.filterName === null){
      throw new Error("Param field not defined or null");
    }
    if (param.predicate === undefined || param.predicate === null){
      throw new Error("Param predicate not defined or null");
    }else{
      predicateIndex = param.field.getPredicateIndex(param.predicate);
      if (predicateIndex < 0){
        throw new Error("Param predicate not found for field");
      }
    }
    if (param.value === undefined || param.value === null){
      throw new Error("Param value not defined or null");
    }

    try {
      this._field = param.field;
      this._caption = param.caption ?? param.field.caption;
      this._filterName = param.filterName;
      this._predicate = param.field.typeSystem.predicates[predicateIndex];
      this._value = param.value;
      this._toValue = param.toValue;
      if (this._predicate.hasSecondParam){
        if (param.toValue === undefined || param.toValue === null){
          throw new Error("Param value not defined or null");
        }
      }
    } catch (error) {
      throw new Error("Param data not valid " + error);
    }
  }

  public GetFilterClause():FilterByClause{
    const fbc:FilterByClause = new FilterByClause();
    fbc.Caption = this.caption;
    fbc.CustomName = this.filterName;
    fbc.DataType = this.field.dataType;
    fbc.DisplayValue = this.value;
    fbc.FieldName = this.field.name;
    fbc.Predicate = this.predicate.key;
    fbc.ToDisplayValue = this.toValue;
    fbc.ToValue = this.toValue;
    fbc.Value = this.value;
    return fbc;
  }
}

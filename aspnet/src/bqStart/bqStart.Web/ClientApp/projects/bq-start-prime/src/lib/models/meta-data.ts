
import validator from 'validator';
import { DateTime } from 'luxon';


export interface Dictionary<T> {
  [Key: string]: T;
}

export class Predicate {
  key: string;
  display: string;
  resource_key: string;
  hasSecondParam: boolean;

  constructor() {

  }


}

/**
 * Defines the type of a property in a entity and other related meta data
 *
 * @export
 * @class TypeSystem
 */
export class TypeSystem {
  key: string;
  predicates: Predicate[];

  constructor(key: string, predicates: Predicate[]) {
    this.key = key;
    this.predicates = predicates;
  }

  escapeValue(value: any): any {
    if (value === undefined || value === null) {
      return null;
    }

    let ret = value;

    switch (this.key) {
      case 'Boolean':
        if (value == "YES" || value == "true") {
          ret = 'true';
        } else if (value == "NO" || value == "false") {
          ret = 'false';
        }
        break;
      case 'Decimal':
      case 'Double':
      case 'Single':
        break;
      case 'Int32':
      case 'Int64':
        break;
      case 'UInt32':
      case 'UInt64':
        break;
      case 'Char':
        ret = `'${value.replace(/\'/g, '%27')}'`;
        break;
      case 'Guid':
        ret = `${value}`;
        break;
      case 'DateTime':
        ret = DateTime.fromISO(value).setLocale('en').toJSON();
        break;
      case 'String':
        ret = "'" + value.replace(/\'/g, '%27').replace(/\+/g, '%2B').replace(/\//g, '%2F').replace(/\?/g, '%3F').replace(/%/g, '%25').replace(/#/g, '%23').replace(/&/g, '%26') + "'";
        break;
      case 'Enum':
        ret = `'${value}'`;
        break;
      default:
        break;
    }
    return ret;
  }
}

export const PREDICATE_CONTAINS: Predicate = Object.assign(new Predicate(), { key: 'contains', display: 'bq-start.filters.contains', resource_key: 'predicate_contains', hasSecondParam: false });
export const PREDICATE_NOT_CONTAINS: Predicate = Object.assign(new Predicate(), { key: 'not contains', display: 'bq-start.filters.notContains', resource_key: 'predicate_not_contains', hasSecondParam: false });
export const PREDICATE_STARTS: Predicate = Object.assign(new Predicate(), { key: 'starts', display: 'bq-start.filters.startsWith', resource_key: 'predicate_starts', hasSecondParam: false });
export const PREDICATE_ENDS: Predicate = Object.assign(new Predicate(), { key: 'ends', display: 'bq-start.filters.endsWith', resource_key: 'predicate_ends', hasSecondParam: false });
export const PREDICATE_EQUALS: Predicate = Object.assign(new Predicate(), { key: '=', display: 'bq-start.filters.eq', resource_key: 'predicate_equals', hasSecondParam: false });
export const PREDICATE_GREATER: Predicate = Object.assign(new Predicate(), { key: '>', display: 'bq-start.filters.gt', resource_key: 'predicate_greater', hasSecondParam: false });
export const PREDICATE_LESS: Predicate = Object.assign(new Predicate(), { key: '<', display: 'bq-start.filters.lt', resource_key: 'predicate_less', hasSecondParam: false });
export const PREDICATE_GREATEREQUALS: Predicate = Object.assign(new Predicate(), { key: '>=', display: 'bq-start.filters.ge', resource_key: 'predicate_greterequals', hasSecondParam: false });
export const PREDICATE_LESSEQUALS: Predicate = Object.assign(new Predicate(), { key: '<=', display: 'bq-start.filters.le', resource_key: 'predicate_lessequals', hasSecondParam: false });
export const PREDICATE_BETWEEN: Predicate = Object.assign(new Predicate(), { key: 'between', display: 'bq-start.filters.between', resource_key: 'predicate_between', hasSecondParam: true });
export const PREDICATE_ISNULL: Predicate = Object.assign(new Predicate(), { key: 'is set', display: 'bq-start.filters.isSet', resource_key: 'predicate_is_set', hasSecondParam: false });
export const PREDICATE_ISNOTNULL: Predicate = Object.assign(new Predicate(), { key: 'is not set', display: 'bq-start.filters.isNotSet', resource_key: 'predicate_is_not_set', hasSecondParam: false });

export const ALL_PREDICATES = {
  'contains': PREDICATE_CONTAINS,
  'not contains': PREDICATE_NOT_CONTAINS,
  'starts': PREDICATE_STARTS,
  'ends': PREDICATE_ENDS,
  '=': PREDICATE_EQUALS,
  '>': PREDICATE_GREATER,
  '<': PREDICATE_LESS,
  '>=': PREDICATE_GREATEREQUALS,
  '<=': PREDICATE_LESSEQUALS,
  'between': PREDICATE_BETWEEN,
  'is set': PREDICATE_ISNULL,
  'is not set': PREDICATE_ISNOTNULL
};

const numberPredicatesWithoutBetween = [PREDICATE_EQUALS, PREDICATE_GREATER, PREDICATE_GREATEREQUALS, PREDICATE_LESS, PREDICATE_LESSEQUALS, PREDICATE_ISNULL, PREDICATE_ISNOTNULL];
const numberPredicates = [PREDICATE_EQUALS, PREDICATE_GREATER, PREDICATE_GREATEREQUALS, PREDICATE_LESS, PREDICATE_LESSEQUALS, PREDICATE_BETWEEN, PREDICATE_ISNULL, PREDICATE_ISNOTNULL];
const onlyEuqals = [PREDICATE_EQUALS];

export const TYPE_SYSTEM: Dictionary<TypeSystem> = {
  "Boolean": new TypeSystem('Boolean', onlyEuqals),
  "Byte": new TypeSystem('Byte', onlyEuqals),
  "SByte": new TypeSystem('SByte', onlyEuqals),
  "Char": new TypeSystem('Char', onlyEuqals),
  "Decimal": new TypeSystem('Decimal', numberPredicates),
  "Double": new TypeSystem('Double', numberPredicates),
  "Single": new TypeSystem('Single', numberPredicates),
  "Int32": new TypeSystem('Int32', numberPredicates),
  "Int64": new TypeSystem('Int64', numberPredicates),
  "UInt32": new TypeSystem('UInt32', numberPredicates),
  "UInt64": new TypeSystem('UInt64', numberPredicates),
  "String": new TypeSystem('String', [PREDICATE_CONTAINS, PREDICATE_NOT_CONTAINS, PREDICATE_STARTS, PREDICATE_ENDS, ...numberPredicatesWithoutBetween]),
  "Enum": new TypeSystem('Enum', onlyEuqals),
  "DateTime": new TypeSystem('DateTime', numberPredicates),
  "Guid": new TypeSystem('Guid', onlyEuqals),
};

/**
 * Various validation types
 *
 * @export
 * @enum {number}
 */
export enum ValidationType {
  required = 0,
  maxLength = 1,
  minLength = 2,
  range = 3,
  regularExpression = 4,
  compare = 5,
  email = 6,
  phone = 7
}

export interface ValidationData {
  validationType: ValidationType;
  errorMessage: string;
  otherProperty: string;
  otherPropertyDisplayName: string;
  maxLength?: number;
  minLength?: number;
  maxRange?: number;
  minRange?: number;
  pattern: string;
  isRequired?: boolean;
  isEmail?: boolean;
}

export interface EnumItem {
  id: number;
  name: string;
}

/**
 * Defines a field with meta data information.
 *
 * @export
 * @class MetadataField
 */
export class MetadataField {
  name: string;
  caption: string;
  dataType: string;
  maxLength?: number;
  genericDataType: string;
  isNullable: boolean;
  validations: ValidationData[];
  hasForeignKey: boolean;
  foreignKeyName: string;
  relatedFormViewId: string;
  relatedListViewId: string;
  allowRelatedViewSelect: boolean;
  allowRelatedViewInsert: boolean;
  childFields: Dictionary<MetadataField>;
  isPrimaryKey: boolean;
  autoGen: boolean;
  isEnum: boolean;
  enums: EnumItem[];

  //clientside properties
  typeSystem: TypeSystem;
  isBool: boolean;
  isString: boolean;
  isNumber: boolean;
  isInteger: boolean;
  isDate: boolean;
  isGuid: boolean;
  dateFormat: string;
  parent: MetadataField;

  public static fromObject(obj: any): MetadataField {
    const newObj = new MetadataField();
    const ret: MetadataField = Object.assign(newObj, obj);
    if (ret.dataType) {
      if (TYPE_SYSTEM[ret.dataType]) {
        ret.typeSystem = TYPE_SYSTEM[ret.dataType];
      }
      //these are used to determine what type of control to display in client side
      switch (ret.dataType) {
        case 'Boolean':
          ret.isBool = true;
          break;
        case 'Decimal':
        case 'Double':
        case 'Single':
          ret.isNumber = true;
          break;
        case 'Int32':
        case 'Int64':
          ret.isInteger = true;
          break;
        case 'UInt32':
        case 'UInt64':
          ret.isInteger = true;
          break;
        case 'Char':
          ret.isString = true;
          break;
        case 'Guid':
          ret.isGuid = true;
          break;
        case 'DateTime':
          ret.isDate = true;
          break;
        case 'String':
          ret.isString = true;
          break;
        default:
          break;
      }
    }

    //link parents to child runtime as JSON don't send us object reference links
    if (ret.childFields) {
      //2nd level
      for (const key in ret.childFields) {
        const cf = ret.childFields[key];
        cf.parent = ret;
        //lets link 3rd level
        if (cf.childFields) {
          for (const cfKey in cf.childFields) {
            const cff = cf.childFields[cfKey];
            cff.parent = cf;
          }
        }
      }
    }

    return ret;
  }

  IsValidFilterData(data: any): boolean {
    if (data === undefined || data === null)
      return false;

    switch (this.dataType) {
      case 'Boolean':
        const lowerString = (data + "").toLowerCase();
        if (lowerString === 'true' || lowerString === 'false')
          return true;
        break;
      case 'Decimal':
      case 'Double':
      case 'Single':
        if (!isNaN(data))
          return true;
        break;
      case 'Int32':
      case 'Int64':
        if (Number.isInteger(+data))
          return true;
        break;
      case 'UInt32':
      case 'UInt64':
        if (Number.isInteger(+data) && (+data) >= 0)
          return true;
        break;
      case 'Char':
        const lowerString1 = (data + "").toLowerCase();
        if (lowerString1.length >= 0 && lowerString1.length <= 1)
          return true;
        break;
      case 'DateTime':
        const mom = DateTime.fromISO(data);
          return mom.isValid;
        break;
      case 'String':
        return true;
      case 'Guid':
        return validator.isUUID(data);
      default:
        break;
    }

    return false;
  }

  getPredicateIndex(predicateKey: string): number {
    let index = -1;
    for (let i = 0; i < this.typeSystem.predicates.length; i++) {
      const pd = this.typeSystem.predicates[i];
      if (pd.key == predicateKey) {
        index = i;
        break;
      }
    }
    return index;
  }

  hasEmailValidator():boolean{
    let hasEmail = this.validations.filter(x => x.isEmail).map(x => x.isEmail);
    return (hasEmail !== undefined && hasEmail.length>0);
  }
}

export class PrimaryKey {
  keyName: string;
  keyType: string;
}


/**
 * Defines a entity level metadata
 *
 * @export
 * @class ModelMetadata
 */
export class ModelMetadata {
  allowAdd: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowSelect: boolean;
  typeName: string;
  keys: PrimaryKey[];
  fields: Dictionary<MetadataField>;

  public static fromObject(obj: any): ModelMetadata {
    const ret: ModelMetadata = Object.assign(new ModelMetadata(), obj);
    for (var key in ret.fields) {
      ret.fields[key] = MetadataField.fromObject(ret.fields[key]);
    }
    return ret;
  }

  public getPrimaryKeyAsUrl<T>(values: any[]): string {
    const finalString = this.keys.map((obj, i) => {
      const field = this.fields[obj.keyName];
      let value = values[i];
      if (field.isString) {
        value = atob(value);
      }
      if (values.length == 1) {
        return field.typeSystem.escapeValue(value);
      } else {
        return `${field.name}=${field.typeSystem.escapeValue(value)}`;
      }
    }).join(",");
    return finalString;
  }

  public getPrimaryKeyAsRouteParam<T>(model: T): string {
    const finalString = this.keys.map(obj => {
      const field = this.fields[obj.keyName];
      const value = model[obj.keyName as keyof T];
      if (field.isString) {
        return btoa(String(value));
      } else {
        return value;
      }
    }).join("~");
    return finalString;
  }

  public parseRouteParamToKeys(url: string|null): any[] {
    if (url!=null){
      const ret = url.split("~");
      return ret;
    } else{
      return [];
    }
  }
}

export interface IBaseEvents {

  onAfterInitComplete(): void;
  onAfterServerDataReceived(): void;
}


export class ViewOptionalData {
  $expandClause?: string;
  $selectClause?: string;
  $filterClause?: string;
}

export class MessageBusPayLoad {
  operationType: OperationType;
  key: any;
  typeName: string;
}

export enum OperationType{
  Added,
  Updated,
  Deleted,
  ServerUpdated,
  ServerAdded,
  ServerDeleted
}

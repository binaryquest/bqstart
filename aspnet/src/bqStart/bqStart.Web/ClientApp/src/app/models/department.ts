import { BaseEntity } from "projects/bq-start-core/src/public-api";

export class Department extends BaseEntity<number>{
    DepartmentName: string;
    AddressId: number|null;
    AddressNavigation: Address = new Address();
}

export class Address extends BaseEntity<number>{
  AddressLine1:string;
  City:string;
}

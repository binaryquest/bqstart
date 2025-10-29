import { BaseEntity } from "bq-start-core";

export class Department extends BaseEntity<number>{
    DepartmentName: string;
    AddressId: number|null;
    AddressNavigation: Address = new Address();
}

export class Address extends BaseEntity<number>{
  AddressLine1:string;
  City:string;
}

import { BaseEntity } from "projects/bq-start-prime/src/public-api";

export class Patient extends BaseEntity<number>{
  Name: string;
  Age: string;
  DOB: Date;
  Sex: string;
  CustomerId: number;
}

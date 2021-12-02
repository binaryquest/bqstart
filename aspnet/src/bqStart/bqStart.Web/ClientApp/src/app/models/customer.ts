import { BaseEntity } from "projects/bq-start-prime/src/public-api";

export class Customer extends BaseEntity<number>{
  Name: string;
  Phone: string;
  Email: string;
  CreditLimit: number;
  Rating: number;
  Password: string;
  VerifyPassword: string;
  PasswordHash: string;
  VerifiedCustomer: boolean;
  PreferredCustomer?: boolean;
}

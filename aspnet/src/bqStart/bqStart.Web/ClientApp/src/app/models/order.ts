import { BaseEntity } from "dist/bq-start-prime/public-api";

export class Order {
  Id: string;
  CustomerId: number;
  OrderChar: string;
  OrderConfirmed: boolean;
  OrderDate: Date;
  OrderNote: string;
  OrderPrice: number;
  Details: OrderLine[];
}


export class OrderLine  {
  OrderId: string;
  ProductId: number;
  Qty: number;
}

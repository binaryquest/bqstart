export class Product {
  Id: number;
  GroupId: number;
  Name: string;
  Price: number;
  Discount: number;
  Description: string;
  ImageFromERP: string;
  ECommerceData: string;
  MetaDataValues: string;
  Code: string;
  PackagingMUName: string;
  SyncedOn: Date;
  IsDeleted: boolean;
  IsStockOut: boolean;
  IsHotDeal: boolean;
  CategoryText: string;
  SubCategoryText: string;
  SubCategoryId: number;
  Index: string;
  SubCategory?: any;
  ProductType: ProductType;
}

export enum ProductType
{
    Medicine = 0,
    Wellbeing = 1,
    Cosmetics = 2
}

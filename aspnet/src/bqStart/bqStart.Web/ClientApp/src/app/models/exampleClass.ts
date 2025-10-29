import { BaseEntity } from "bq-start-core";
import { Department } from "./department";

export class ExampleClass extends BaseEntity<number>{
    ClassName: string;
    DepartmentId: number;
    IsActive: boolean;
    Department: Department | undefined;
    ClassDate: Date | null;
    ClassType: ExampleClassType;
}

export enum ExampleClassType{
  RegularClass = 0,
  NewClass = 1
}

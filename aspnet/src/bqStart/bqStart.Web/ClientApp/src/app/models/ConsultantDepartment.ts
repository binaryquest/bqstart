import { BaseEntity } from "projects/bq-start-prime/src/public-api";

export class ConsultantDepartment extends BaseEntity<number>{
    DepartmentName: string;
    DepartmentRoomNo: number;
}

import { BaseEntity } from "projects/bq-start-prime/src/public-api";
export class AppointmentStatus extends BaseEntity<number> {
    StatusName: string;
    Description: string;
}

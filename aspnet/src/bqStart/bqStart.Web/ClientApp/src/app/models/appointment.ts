
import { BaseEntity } from "projects/bq-start-prime/src/public-api";
export class Appointment extends BaseEntity<number> {
    ConsultantId: number;
    PatientName: string;
    PatientAge: number | null;
    PatientGender: PatientGender;
    PatientMobile: string;
    PatientEmail: string;
    PatientAddress: string;
    ExpectedDate: string;
    ExpectedDateAlt: string | null;
    Reason: string;
    SerialNumber: number | null;
    AppointmentStatusId: number;
    AppointmentDate: string | null;
    // Consultant: Consultant;
    // AppointmentStatus: AppointmentStatus;
}


export enum PatientGender
{
    Male = 0,
    Female = 1,
    Other = 2
}

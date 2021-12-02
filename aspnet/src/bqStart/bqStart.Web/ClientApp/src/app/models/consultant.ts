import { BaseEntity } from "projects/bq-start-prime/src/public-api";
import { ConsultantDepartment } from "./ConsultantDepartment";

export class Consultant extends BaseEntity<number>{

        ConsultantName: string;
        DepartmentId: number;
        VisitingTime: string | null;
        Address: string | null;
        Email: string | null;
        Mobile: string | null;
        BloodGroup: string | null;
        Image: string | null;
        Designation: string | null;
        Degree: string | null;
        AcademicCareer: string | null;
        SpecialTraining: string | null;
        Achievement: string | null;
        Speciality: string | null;
        Organization: string | null;
        BmdcregNo: string | null;
        IsActive: boolean | null;
        Department: ConsultantDepartment;

  }

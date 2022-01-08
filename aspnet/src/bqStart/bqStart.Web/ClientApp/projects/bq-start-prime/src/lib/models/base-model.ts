export class BaseEntity<T>{
  Id: T;
  CreatedOn: Date|null;
  ModifiedOn: Date|null;
  CreatedBy: string|null;
  ModifiedBy: string|null;
  RecordState: RecordState;
}

export enum RecordState {
  Unchanged = "Unchanged",
  Inserted = "Inserted",
  Modified = "Modified",
  Deleted = "Deleted"
}

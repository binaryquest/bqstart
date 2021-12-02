export class BaseEntity<T>{
  Id: T;
  CreatedOn: Date;
  ModifiedOn: Date;
  CreatedBy: string;
  ModifiedBy: string;
  RecordState: string;

  getRecordState(): RecordState {
    if (this.RecordState === "Inserted") {
      return RecordState.Inserted;
    } else if (this.RecordState === "Modified") {
      return RecordState.Modified;
    } else if (this.RecordState === "Deleted") {
      return RecordState.Deleted;
    } else {
      return RecordState.Unchanged;
    }
  }

  setRecordState(rs: RecordState) {
    switch (rs) {
      case RecordState.Unchanged:
        this.RecordState = "Unchanged";
        break;
      case RecordState.Inserted:
        this.RecordState = "Inserted";
        break;
      case RecordState.Modified:
        this.RecordState = "Modified";
        break;
      case RecordState.Deleted:
        this.RecordState = "Deleted";
        break;
    }
  }
}

export enum RecordState {
  Unchanged = 0,
  Inserted = 1,
  Modified = 2,
  Deleted = 3
}

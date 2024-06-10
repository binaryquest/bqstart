/**
 * This class represents the base class for an entity defined in the backend
 *
 * @export
 * @class BaseEntity
 * @template T
 */
export class BaseEntity<T>{
  Id: T;
  CreatedOn: Date|null;
  ModifiedOn: Date|null;
  CreatedBy: string|null;
  ModifiedBy: string|null;
  RecordState: RecordState;
}


/**
 * Enum to store the state of a record from frontend to backend if this was changed, inserted or deleted.
 * Used to synchronize the state with ef core.
 *
 * @export
 * @enum {number}
 */
export enum RecordState {
  Unchanged = "Unchanged",
  Inserted = "Inserted",
  Modified = "Modified",
  Deleted = "Deleted"
}


export class AppShortcutKey{
  key: string;
  label: string;
  description: string;
}

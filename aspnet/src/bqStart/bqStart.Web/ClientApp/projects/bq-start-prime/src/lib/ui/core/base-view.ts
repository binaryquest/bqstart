/**
 * base class for a view
 *
 * @export
 * @interface IBaseView
 */
export interface IBaseView {
  canClose():boolean;
  refresh():void;
  canOpen(key:any):boolean;
}

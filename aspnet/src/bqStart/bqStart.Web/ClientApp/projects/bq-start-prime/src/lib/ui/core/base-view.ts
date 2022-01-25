export interface IBaseView {
  canClose():boolean;
  refresh():void;
  canOpen(key:any):boolean;
}

export class ActionEvent {
  static ACTION:string = "actionEvent:action";

  get type():string {
    return this._type;
  }

  get action():string {
    return this._action;
  }

  constructor(private _type:string, private _action:string) {
  }
}
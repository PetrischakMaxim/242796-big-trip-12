import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setTasks(points) {
    this._points = [...points];
  }

  getTasks() {
    return this._points;
  }
}

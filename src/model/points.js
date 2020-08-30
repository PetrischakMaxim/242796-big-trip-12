import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoins(points) {
    this._points = [...points];
  }

  getPoints() {
    return this._points;
  }
}

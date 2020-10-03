import Observer from "../../utils/observer.js";
import {FilterType} from "../../const.js";

export default class Filter extends Observer {

  constructor() {
    super();
    this._current = FilterType.EVERYTHING;
  }

  set(updateType, filter) {
    this._current = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._current;
  }
}

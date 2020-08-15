import {createElement} from "../../utils.js";
const createEventDayList = () => `<ul class="trip-days"></ul>`;

export default class EventDayList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventDayList();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

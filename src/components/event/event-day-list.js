import {createElement} from "../../utils/dom-utils.js";

const createEventDayListTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class EventDayList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventDayListTemplate();
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

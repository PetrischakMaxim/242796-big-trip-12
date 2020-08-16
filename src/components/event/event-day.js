import {getDateTimeFormat, getFormatedDate} from "../../utils/utils.js";
import {createElement} from "../../utils/dom-utils.js";
import {createEventList} from "./event-list.js";

const createEventDayTemplate = (date, count) => {
  const dateTime = getDateTimeFormat(date);
  const formatedDate = getFormatedDate(date).toLowerCase();
  return `<li class="trip-days__item day">
    <div class="day__info">
      <span class="day__counter">
        ${count}
      </span>
      <time class="day__date" datetime="${dateTime}">
        ${formatedDate}
      </time>
    </div>
    ${createEventList()}
  </li>`;
};

export default class EventDay {
  constructor(date, count) {
    this._element = null;
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    return createEventDayTemplate(this._date, this._count);
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

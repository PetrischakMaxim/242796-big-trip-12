import AbstractView from "../abstract.js";
import {getDateTimeFormat, getFormatedDate} from "../../utils/utils.js";
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

export default class EventDay extends AbstractView {
  constructor(date, count) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    return createEventDayTemplate(this._date, this._count);
  }
}

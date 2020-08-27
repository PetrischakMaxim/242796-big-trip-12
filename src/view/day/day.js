import AbstractView from "../abstract/abstract.js";
import {getDateTimeFormat, getFormatedDate} from "../../utils/date-utils.js";

const createDayTemplate = (date, count) => (
  `<li class="trip-days__item day">
    <div class="day__info">
      <span class="day__counter">
        ${count}
      </span>
      <time class="day__date" datetime="${getDateTimeFormat(date)}">
        ${getFormatedDate(date).toLowerCase()}
      </time>
    </div>
  </li>`
);

export default class Day extends AbstractView {
  constructor(date, count) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._count);
  }
}

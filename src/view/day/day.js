import AbstractView from "../abstract/abstract.js";
import {getDateFormat, getFormatedDate} from "../../utils/date-utils.js";

const createDayTemplate = (date, count) => (
  `<li class="trip-days__item day">
    <div class="day__info">
      <span class="day__counter">
        ${count}
      </span>
      <time class="day__date" datetime="${getDateFormat(date)}">
        ${getFormatedDate(date)}
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

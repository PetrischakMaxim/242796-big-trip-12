import AbstractView from "../abstract/abstract.js";
import {getDateFormat, getFormatedDate} from "../../utils/date-utils.js";

export default class Day extends AbstractView {

  constructor(date, count) {
    super();
    this._date = date;
    this._count = count;
  }

  getTemplate() {
    return (
      `<li class="trip-days__item day">
        <div class="day__info">
          <span class="day__counter">
            ${(!this._count) ? `` : this._count }
          </span>
          <time class="day__date" datetime="${(!this._date) ? `` : getDateFormat(this._date)}">
            ${(!this._date) ? `` : getFormatedDate(this._date)}
          </time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
    );
  }

  getList() {
    return this.getElement()
      .querySelector(`.trip-events__list`);
  }
}

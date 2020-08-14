import {getDateTimeFormat, getFormatedDate} from "../../utils.js";
import {createEventList} from "./event-list.js";

export const createEventDay = (date, count) => {
  const dateTime = getDateTimeFormat(date);
  const formatedDate = getFormatedDate(date).toLowerCase();
  return `
  <li class="trip-days__item day">
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

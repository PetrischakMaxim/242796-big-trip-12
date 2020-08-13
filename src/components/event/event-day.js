import {getDateTimeFormat, getFormatedDate} from "../../utils.js";
import {createEventList} from "./event-list.js";

export const createEventDay = (date, count) => {
  return `<li class="trip-days__item day">
  <div class="day__info">
    <span class="day__counter">${count}</span>
    <time class="day__date" datetime="${getDateTimeFormat(date)}">${getFormatedDate(date).toLowerCase()}</time>
  </div>
  ${createEventList()}
</li>

`;
};

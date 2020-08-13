import {getDateTimeFormat, getFormatedDate} from "../../utils.js";

export const createTripDay = (date, count) => {
  return `<li class="trip-days__item day">
  <div class="day__info">
    <span class="day__counter">${count}</span>
    <time class="day__date" datetime="${getDateTimeFormat(date)}">${getFormatedDate(date).toLowerCase()}</time>
  </div>
</li>
`;
};

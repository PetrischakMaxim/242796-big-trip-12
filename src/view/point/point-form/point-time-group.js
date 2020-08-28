import {generateId} from "../../../utils/utils.js";
import {formatDateToPlaceholder} from "../../../utils/date-utils.js";

export const createTimeGroupTemplate = (startDate, endDate) => {
  const id = generateId();
  return `
  <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">
        From
      </label>
      <input class="event__input event__input--time" date-time="start"
        id="event-start-time-${id}" type="text" name="event-start-time"
        value="${formatDateToPlaceholder(startDate)}">
      —
      <label class="visually-hidden" for="event-end-time-${id}">
        To
      </label>
      <input class="event__input  event__input--time" date-time="end"
        id="event-end-time-${id}" type="text" name="event-end-time"
        value="${formatDateToPlaceholder(endDate)}">
    </div>
  `;
};

import {formatDateToPlaceholder} from "../../../utils/date-utils.js";

export const createTimeTemplate = (pointData) => (`
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time">From</label>
    <input class="event__input event__input--time"
      id="event-start-time" type="text" data-time="start" name="event-start-time"
      value="${formatDateToPlaceholder(pointData.start)}"> —
    <label class="visually-hidden" for="event-end-time">To</label>
    <input class="event__input  event__input--time"
      id="event-end-time" type="text" data-time="end" name="event-end-time"
      value="${formatDateToPlaceholder(pointData.end)}">
   </div>`
);

import {CITY_LIST, BLANK_TASK} from "../../const.js";
import {getTimeFormat, formatDateToPlaceholder, createElement} from "../../utils.js";
import {createTripOffersTemplate} from "./event-offers.js";
import {createTripDetailsTemplate} from "./event-details.js";
import {createTripCityListTemplate} from "./event-city-list.js";
import {createTripWaypointTemplate} from "./event-waypoint.js";
import {createEventTimeGroupTemplate} from "./event-time.js";
import {createEventPriceTemplate} from "./event-price.js";

const createEventFormTemplate = (route) => {
  const {
    waypoint,
    waypointTypes,
    waypointTypes: {transfer, activity},
    cost,
    destination,
    tripDates: {start, end},
    offers,
    info,
    hasOffers = false,
    hasInfo = false,
  } = route;

  const [transferType, activityType] = Object.keys(waypointTypes);
  const startDate = `${formatDateToPlaceholder(start)} ${getTimeFormat(start)}`;
  const endDate = `${formatDateToPlaceholder(end)} ${getTimeFormat(end)}`;

  const createTripEventsTemplate = () => {
    return (hasOffers || hasInfo) ?
      `<section class="event__details">
        ${createTripOffersTemplate(offers)}
        ${createTripDetailsTemplate(info)}
      </section>`
      :
      ``;
  };

  const createEventTypeListTemplate = () => {
    return `
    <div class="event__type-list">
        ${createTripWaypointTemplate(transferType, transfer, waypoint)}
        ${createTripWaypointTemplate(activityType, activity, waypoint)}
    </div>`;
  };

  return `<li class="trip-events__item">
  <form class="event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17"
            src="img/icons/${waypoint.toLowerCase()}.png"
            alt="${waypoint} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        ${createEventTypeListTemplate()}
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${waypoint}${transfer.includes(waypoint) ? ` to` : ` in`}
        </label>
        <input class="event__input  event__input--destination"
          id="event-destination-1" type="text" name="event-destination"
          value="${destination}" list="destination-list-1">
        ${createTripCityListTemplate(CITY_LIST)}
      </div>
      ${createEventTimeGroupTemplate(startDate, endDate)}
      ${createEventPriceTemplate(cost)}
      <button class="event__save-btn btn btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    ${createTripEventsTemplate()}
  </form>
  </li>`;
};


export default class EventForm {
  constructor(task) {
    this._task = task || BLANK_TASK;
    this._element = null;
  }

  getTemplate() {
    return createEventFormTemplate(this._task);
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


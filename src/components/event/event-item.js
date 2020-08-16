import AbstractView from "../abstract.js";
import {getDateAndTimeFormat, getTimeFormat, getTimeOfTrip} from "../../utils/utils.js";
import {createOffersTemplate} from "./event-selected-offers.js";

export const createEventItemTemplate = (route) => {

  const {
    waypoint,
    waypointTypes: {transfer},
    offers,
    destination,
    cost,
    tripDates: {start, end},
  } = route;

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42"
          src="img/icons/${waypoint.toLowerCase()}.png"
          alt="${waypoint} icon">
      </div>
      <h3 class="event__title">
        ${waypoint} ${transfer.includes(waypoint) ? ` to` : ` in`}
        ${destination}
      </h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time"
            datetime="${getDateAndTimeFormat(start)}">
            ${getTimeFormat(start)}
          </time>
          —
          <time class="event__end-time"
            datetime="${getDateAndTimeFormat(end)}">
            ${getTimeFormat(end)}
          </time>
        </p>
        <p class="event__duration">
          ${getTimeOfTrip(start, end)}
        </p>
      </div>
      <p class="event__price">
        €&nbsp;<span class="event__price-value">${cost}</span>
      </p>
      ${createOffersTemplate(offers)}
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
</li>`;
};


export default class EventItem extends AbstractView {
  constructor(route) {
    super();
    this._element = null;
    this._route = route;
  }

  getTemplate() {
    return createEventItemTemplate(this._route);
  }
}


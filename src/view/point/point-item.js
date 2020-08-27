import AbstractView from "../abstract/abstract.js";

import {
  getDateAndTimeFormat,
  getTimeFormat,
  getTimeOfTrip
} from "../../utils/date-utils.js";

export const createPointItemTemplate = (point) => {

  const {
    waypoint,
    waypointTypes: {transfer},
    offers,
    destination,
    cost,
    tripDates: {start, end},
  } = point;

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
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${offers.map((offer) => (
    `<li class="event__offer">
          <span class="event__offer-title">${offer.name}</span>
          +
          €&nbsp;<span class="event__offer-price">${offer.cost}</span>
        </li>`)).join(``)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
</li>`;
};


export default class PointItem extends AbstractView {

  constructor(point) {
    super();
    this._point = point;
    this._clickHandler = null;

    this._onClick = this._onClick.bind(this);
  }

  getTemplate() {
    return createPointItemTemplate(this._point);
  }

  setClickHandler(callback) {
    this._clickHandler = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onClick);
  }

  _onClick() {
    this._clickHandler();
  }

}


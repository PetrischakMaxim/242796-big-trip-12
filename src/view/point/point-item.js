import AbstractView from "../abstract/abstract.js";
import {getDateTimeFormat, getTimeFormat, getTimeOfTrip} from "../../utils/date-utils.js";
import {capitalizeString} from "../../utils/utils.js";
import {PointType} from "../../const.js";

export const createPointItemTemplate = (point) => {

  const {
    waypoint,
    price,
    start,
    end,
    offers,
    info,
  } = point;

  const createOffersList = () => {
    if (!offers.length) {
      return ``;
    }
    return (
      `<h4 class="visually-hidden">Offers:</h4>
       <ul class="event__selected-offers">
        ${offers.map((offer, count) => {
        const template = `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span> + €&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>`;
        return (count <= 2) ? template : ``;
      }).join(``)}
      </ul>`
    );
  };

  const pointIcon = (
    `<div class="event__type">
      <img class="event__type-icon"
      width="42" height="42" src="img/icons/${waypoint.toLowerCase()}.png"
      alt="${waypoint} icon">
    </div>`
  );

  const pointTitle = (
    `<h3 class="event__title">
      ${capitalizeString(waypoint)}
      ${PointType.TRANSFER.includes(capitalizeString(waypoint)) ? ` to` : ` in`}
      ${info.name}
    </h3>`
  );

  const pointSchedule = (
    `<div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDateTimeFormat(start)}">
            ${getTimeFormat(start)}
          </time> —
          <time class="event__end-time" datetime="${getDateTimeFormat(end)}">
            ${getTimeFormat(end)}
          </time>
        </p>
        <p class="event__duration">${getTimeOfTrip(start, end)}</p>
    </div>`
  );

  const pointPrice = (
    `<p class="event__price">€&nbsp;<span class="event__price-value">${price}</span></p>`
  );

  return (
    `<li class="trip-events__item">
      <div class="event">
        ${pointIcon}
        ${pointTitle}
        ${pointSchedule}
        ${pointPrice}
        ${createOffersList()}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );

};

export default class PointItem extends AbstractView {

  constructor(point) {
    super();
    this._point = point;

    this._clickHandler = this._clickHandler.bind(this);
    this._onClick = null;
  }

  getTemplate() {
    return createPointItemTemplate(this._point);
  }

  setClickHandler(callback) {
    this._onClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._clickHandler);
  }

  _clickHandler() {
    this._onClick();
  }

}


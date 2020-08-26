import SmartView from "../smart.js";

import {createOffersTemplate} from "./point-offers.js";
import {createDetailsTemplate} from "./point-details.js";
import {createCityListTemplate} from "./point-city-list.js";
import {createPointTemplate} from "./point.js";
import {createTimeGroupTemplate} from "./point-time-group.js";
import {createPriceTemplate} from "./point-price.js";

import {
  CITY_LIST,
  BLANK_POINT,
  TRIP_IMAGE_URL,
  TRIP_SENTENCE
} from "../../const.js";

import {
  getTimeFormat,
  formatDateToPlaceholder,
  getRandomInteger,
  generateSentence,
  generateImage
} from "../../utils/utils.js";

const createPointFormTemplate = (data) => {
  const {
    waypoint,
    waypointTypes,
    waypointTypes: {transfer, activity},
    cost,
    destination,
    tripDates: {start, end},
    offers,
    info,
    hasOffers,
    hasInfo,
    isFavorite,
  } = data;

  const [transferType, activityType] = Object.keys(waypointTypes);
  const startDate = `${formatDateToPlaceholder(start)} ${getTimeFormat(start)}`;
  const endDate = `${formatDateToPlaceholder(end)} ${getTimeFormat(end)}`;

  const createEventTypeListTemplate = () => {
    return `
    <div class="event__type-list">
        ${createPointTemplate(transferType, transfer, waypoint)}
        ${createPointTemplate(activityType, activity, waypoint)}
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
        ${createCityListTemplate(CITY_LIST)}
      </div>
      ${createTimeGroupTemplate(startDate, endDate)}
      ${createPriceTemplate(cost)}
      <button class="event__save-btn btn btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden"
        type="checkbox" name="event-favorite" ${(isFavorite) ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1"><span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg></label>
        <button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>
    </header>
    ${(hasOffers || hasInfo) ?
    `<section class="event__details">
        ${(hasOffers) ? createOffersTemplate(offers) : ``}
        ${(hasInfo) ? createDetailsTemplate(info) : ``}
     </section>` : ``}
  </form>
  </li>`;
};


export default class PointForm extends SmartView {

  constructor(point = BLANK_POINT) {
    super();
    this._data = PointForm.parsePointToData(point);

    this._onSubmit = null;
    this._onFavoriteClick = null;
    this._onCloseClick = null;

    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
    this._onFavoriteClickHandler = this._onFavoriteClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);

    this._setInnerHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._onSubmit);
    this.setCloseButtonHandler(this._onCloseClick);
    this.setFavoriteClickHandler(this._onFavoriteClick);
  }

  getTemplate() {
    return createPointFormTemplate(this._data);
  }

  setFormSubmitHandler(callback) {
    this._onSubmit = callback;
    this.getElement()
      .querySelector(`.event`)
      .addEventListener(`submit`, this._onSubmitHandler);
  }

  setCloseButtonHandler(callback) {
    this._onCloseClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onCloseClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._onFavoriteClick = callback;
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, this._onFavoriteClickHandler);
  }

  _onSubmitHandler(evt) {
    evt.preventDefault();
    this._onSubmit(PointForm.parseDataToPoint(this._data));
  }

  _onCloseClickHandler() {
    this._onCloseClick(PointForm.parseDataToPoint(this._data));
  }

  _onFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._onFavoriteClick();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`.event__type-input`)
      .forEach((input) => {
        input.addEventListener(`change`, this._typeToggleHandler);
      });

    this.getElement()
        .querySelector(`.event__input--destination`)
        .addEventListener(`change`, this._destinationToggleHandler);

  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const {value, list} = evt.target;
    const isDestination = [...list.options].some((opt) => opt.value === value);

    if (!isDestination) {
      return;
    }

    this.updateData({
      destination: evt.target.value,
      hasInfo: Boolean(getRandomInteger(0, 1)),
      info: {
        description: generateSentence(TRIP_SENTENCE),
        images: generateImage(TRIP_IMAGE_URL)
      }
    });
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    const updatedWaypoint = evt.target.value[0].toUpperCase() + evt.target.value.slice(1);
    this.updateData({
      waypoint: updatedWaypoint,
    });
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {
      waypoint: point.waypoint,
      destination: point.destination,
      info: point.info,
      hasInfo: point.hasInfo,
    });
  }

  static parseDataToPoint(data) {
    return Object.assign({}, data);
  }

}


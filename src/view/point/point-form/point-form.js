import SmartView from "../../smart/smart.js";

import {createOffersTemplate} from "./point-offers.js";
import {createDetailsTemplate} from "./point-details.js";
import {createCityListTemplate} from "./point-city-list.js";
import {createPointTemplate} from "./point.js";
import {createTimeGroupTemplate} from "./point-time-group.js";

import he from "he";
import flatpickr from "flatpickr";
import "../../../../node_modules/flatpickr/dist/flatpickr.min.css";

import {
  CITY_LIST,
  BLANK_POINT,
  TRIP_IMAGE_URL,
  TRIP_SENTENCE
} from "../../../const.js";

import {
  getRandomInteger,
  generateSentence,
  generateImage
} from "../../../utils/utils.js";

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

  const createEventTypeListTemplate = () => {
    return `
    <div class="event__type-list">
        ${createPointTemplate(transferType, transfer, waypoint)}
        ${createPointTemplate(activityType, activity, waypoint)}
    </div>`;
  };

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
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
          value="${he.encode(destination)}" list="destination-list-1">
        ${createCityListTemplate(CITY_LIST)}
      </div>
      ${createTimeGroupTemplate(start, end)}
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
          <input class="event__input  event__input--price"
          id="event-price-1" type="text" name="event-price"
          value="${he.encode(String(cost))}">
      </div>
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
    this._datepicker = null;

    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
    this._onFavoriteClickHandler = this._onFavoriteClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._onSubmit = null;
    this._onFavoriteClick = null;
    this._onCloseClick = null;
    this._onDeleteClick = null;

    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._onSubmit);
    this.setCloseButtonHandler(this._onCloseClick);
    this.setFavoriteClickHandler(this._onFavoriteClick);
    this.setDeletePointHandler(this._onDeleteClick);
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

  setDeletePointHandler(callback) {
    this._onDeleteClick = callback;
    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._formDeleteClickHandler);
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

  _setDatepicker() {
    this._removeDatePicker();

    this._datepicker = flatpickr(
        this.getElement().querySelector(`.event__input--time`),
        {
          "enableTime": true,
          "time_24hr": true,
          "dateFormat": `Y-m-d H:i`,
          "defaultDate": this._data.tripDates.start,
          "onChange": this._dateChangeHandler
        }
    );
  }


  _removeDatePicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _dateChangeHandler([date]) {
    this.updateData({
      tripDates: {
        start: date
      }
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._onDeleteClick(PointForm.parseDataToPoint(this._data));
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


import SmartView from "../smart/smart.js";
import he from "he";
import flatpickr from "flatpickr";
import "../../../node_modules/flatpickr/dist/flatpickr.min.css";

import {
  CITY_LIST,
  BLANK_POINT,
  TRIP_IMAGE_URL,
  TRIP_SENTENCE
} from "../../const.js";

import {
  getRandomInteger,
  generateSentence,
  generateImage,
} from "../../utils/utils.js";

import {formatDateToPlaceholder} from "../../utils/date-utils.js";

const createTimeGroupTemplate = (startDate, endDate) => (`
  <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time}">
        From
      </label>
      <input class="event__input event__input--time"
        id="event-start-time" type="text" name="event-start-time"
        value="${formatDateToPlaceholder(startDate)}"> —
      <label class="visually-hidden" for="event-end-time">
        To
      </label>
      <input class="event__input  event__input--time"
        id="event-end-time" type="text" name="event-end-time"
        value="${formatDateToPlaceholder(endDate)}">
   </div>
  `
);

const pointTemlate = (point, currentPoint) => (
  `<div class="event__type-item">
    <input id="event-type-${point.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
    value="${point.toLowerCase()}"
    ${(point === currentPoint) ? `checked` : ``}>
    <label class="event__type-label event__type-label--${point.toLowerCase()}"
    for="event-type-${point.toLowerCase()}-1">${point}</label>
  </div>`
);

const createPointTemplate = (type, points, currentPoint) => (
  `<fieldset class="event__type-group">
      <legend class="visually-hidden">${type}</legend>
      ${Array.isArray(points) ? points.map((point) => pointTemlate(point, currentPoint)).join(``) : ``}
  </fieldset>`
);

const generateOffersTemplate = (offers) => {
  return offers.map((offer)=> {
    const {name, cost} = offer;
    const offerType = name.split(` `).pop();
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden"
    id="event-offer-${offerType}-1"
    type="checkbox"
    name="event-offer-${offerType}"
    ${getRandomInteger(0, 1) ? `checked` : ``} >
    <label class="event__offer-label"
    for="event-offer-${offerType}-1">
      <span class="event__offer-title">${name}</span>
      +
      €&nbsp;<span class="event__offer-price">${cost}</span>
    </label>
  </div>`;
  }).join(``);
};

const createOffersTemplate = (offers) => (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">${generateOffersTemplate(offers)}</div>
  </section>`
);


const createPhotoTape = (images) => (
  `<div class="event__photos-tape">
    ${images.map((url)=> `<img class="event__photo" src="${url}" alt="Event photo"/>`).join(``)}
  </div>`
);

const createDetailsTemplate = (info) => {
  const {description, images} = info;
  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">
        Destination
      </h3>
      <p class="event__destination-description">
        ${description}
      </p>
      <div class="event__photos-container">
        ${createPhotoTape(images)}
      </div>
    </section>`;
};

export const createCityListTemplate = (cities) => (
  `<datalist id="destination-list-1">
    ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
  </datalist>
  `
);


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
  }

  removeElement() {
    super.removeElement();
    this._removeDatePicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
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
    const element = this.getElement();
    element
      .querySelectorAll(`.event__type-input`)
      .forEach((input) => {
        input.addEventListener(`change`, this._typeToggleHandler);
      });

    element
        .querySelector(`.event__input--destination`)
        .addEventListener(`change`, this._destinationToggleHandler);

    const startTimeElement = element.querySelector(`[name="event-start-time"]`);
    const endTimeElement = element.querySelector(`[name="event-end-time"]`);


    startTimeElement.addEventListener(`focus`, (evt) => {
      evt.preventDefault();
      this._setDatepicker(startTimeElement, `start`);
    });

    startTimeElement.addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._dateChangeHandler(`start`, this._datepickerStart.selectedDates[0]);
    });

    endTimeElement.addEventListener(`focus`, (evt)=> {
      evt.preventDefault();
      this._setDatepicker(endTimeElement, `end`);
    });

    endTimeElement.addEventListener(`change`, (evt)=> {
      evt.preventDefault();
      this._dateChangeHandler(`end`, this._datepickerEnd.selectedDates[0]);
    });


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

  _setDatepicker(element, time) {
    const datepickerInstance = flatpickr(element, {
      "time_24hr": true,
      "enableTime": true,
      "defaultDate": `today`,
      "minDate": this._data.tripDates.start,
    });


    if (time === `start`) {
      this._datepickerStart = datepickerInstance;
      this._datepickerStart.open();
    }

    if (time === `end`) {
      this._datepickerEnd = datepickerInstance;
      this._datepickerEnd.open();
    }
  }

  _dateChangeHandler(name, value) {
    this.updateData({
      tripDates: {
        [name]: value
      }
    });

    console.log(this._data.tripDates);

  }

  _removeDatePicker() {
    if (this._datepicker) {
      this._datepicker.forEach((datepicker) => {
        datepicker.destroy();
        datepicker = null;
      });
    }
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

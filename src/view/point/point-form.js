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

import {getRandomInteger, generateSentence, generateImage} from "../../utils/utils.js";
import {formatDateToPlaceholder} from "../../utils/date-utils.js";

const createPhotoTape = (images) => (
  `<div class="event__photos-tape">
    ${images.map((url)=> `<img class="event__photo" src="${url}" alt="Event photo"/>`).join(``)}
  </div>`
);

const createDetailsTemplate = (info) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">
      ${info.description}
    </p>
    <div class="event__photos-container">
      ${createPhotoTape(info.images)}
    </div>
  </section>`
);

const createPointFormTemplate = (data, isNewPoint = false) => {
  const {
    id,
    waypoint,
    waypointTypes,
    waypointTypes: {transfer, activity},
    price,
    destination,
    start,
    end,
    offers,
    info,
    hasOffers,
    hasInfo,
    isFavorite,
  } = data;

  const [transferType, activityType] = Object.keys(waypointTypes);

  const createPoints = (type, points, currentPoint) => {

    const createPoint = (point) => (
      `<div class="event__type-item">
        <input id="event-type-${point.toLowerCase()}-${id}"
          class="event__type-input visually-hidden" type="radio" name="event-type"
          value="${point.toLowerCase()}"
          ${(point === currentPoint) ? `checked` : ``}>
        <label class="event__type-label event__type-label--${point.toLowerCase()}"
          for="event-type-${point.toLowerCase()}-${id}">${point}</label>
      </div>`
    );

    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${type}</legend>
        ${Array.isArray(points) ? points.map((point) => createPoint(point)).join(``) : ``}
      </fieldset>`
    );
  };

  const createOffers = () => {
    const offersTemplate = offers.map((offer)=> {
      const offerType = name.split(` `).pop();
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" id="event-offer-${offerType}-${id}"
            type="checkbox" name="event-offer-${offerType}"
            ${getRandomInteger(0, 1) ? `checked` : ``} >
          <label class="event__offer-label"
            for="event-offer-${offerType}-${id}">
            <span class="event__offer-title">${offer.name}</span> + €&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`);
    }).join(``);

    return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${offersTemplate}</div>
    </section>`
    );
  };

  const createTimeGroup = () => (`
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time">From</label>
    <input class="event__input event__input--time"
      id="event-start-time" type="text" data-time="start" name="event-start-time"
      value="${formatDateToPlaceholder(start)}"> —
    <label class="visually-hidden" for="event-end-time">To</label>
    <input class="event__input  event__input--time"
      id="event-end-time" type="text" data-time="end" name="event-end-time"
      value="${formatDateToPlaceholder(end)}">
   </div>`
  );

  const createCityList = (cities) => (
    `<datalist id="destination-list-${id}">
      ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
    </datalist>`
  );

  const pointTypeList = () => (`
    <div class="event__type-list">
      ${createPoints(transferType, transfer, waypoint)}
      ${createPoints(activityType, activity, waypoint)}
    </div>`
  );

  const pointTypeWrapper = (`
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17"
          src="img/icons/${waypoint.toLowerCase()}.png" alt="${waypoint} icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      ${pointTypeList()}
    </div>`
  );

  const pointDestinationTemplate = (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${waypoint}${transfer.includes(waypoint) ? ` to` : ` in`}
      </label>
      <input class="event__input  event__input--destination"
        id="event-destination-${id}" type="text" name="event-destination"
        value="${he.encode(destination)}" list="destination-list-${id}">
      ${createCityList(CITY_LIST)}
    </div>`
  );

  const pointPriceTemplate = (
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>€
      </label>
      <input class="event__input  event__input--price"
        id="event-price-${id}" type="text" name="event-price" value="${he.encode(String(price))}">
    </div>`
  );

  const favoriteInputTempalte = (
    `<input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden"
        type="checkbox" name="event-favorite" ${(isFavorite) ? `checked` : ``}>
     <label class="event__favorite-btn" for="event-favorite-${id}"><span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
     </label>`
  );

  const createFormTemplate = () => (
    `<form class="trip-events__item event event--edit" action="#" method="post">
      <header class="event__header">
        ${pointTypeWrapper}
        ${pointDestinationTemplate}
        ${createTimeGroup()}
        ${pointPriceTemplate}
        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">
          ${(!isNewPoint) ? `Delete` : `Cancel`}
        </button>
        ${(!isNewPoint) ? `${favoriteInputTempalte}` : ``}
        ${(!isNewPoint) ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ``}
      </header>
      ${(hasOffers || hasInfo) ?
      `<section class="event__details">
          ${(hasOffers) ? createOffers() : ``}
          ${(hasInfo) ? createDetailsTemplate(info) : ``}
      </section>` : ``}
    </form>`
  );

  return `<li class="trip-events__item">${createFormTemplate()}</li>`;

};

export default class PointForm extends SmartView {

  constructor(point = BLANK_POINT, isNewPoint = false) {
    super();
    this._data = PointForm.parsePointToData(point);
    this._isNewPoint = isNewPoint;

    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
    this._onFavoriteClickHandler = this._onFavoriteClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._onSubmit = null;
    this._onFavoriteClick = null;
    this._onCloseClick = null;
    this._onDeleteClick = null;

    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();
    this._removeDatePickers();
  }

  restoreHandlers() {
    this.setFormSubmitHandler(this._onSubmit);
    this.setCloseButtonHandler(this._onCloseClick);
    this.setFavoriteClickHandler(this._onFavoriteClick);
    this.setDeletePointHandler(this._onDeleteClick);

    this._setInnerHandlers();
  }

  getTemplate() {
    return (!this._isNewPoint) ?
      createPointFormTemplate(this._data)
      :
      createPointFormTemplate(this._data, true);
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

  _setInnerHandlers() {
    const element = this.getElement();
    element
      .querySelectorAll(`.event__type-input`)
      .forEach((input) => {
        input.addEventListener(`change`, this._typeToggleHandler);
      });

    element
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);

    element
        .querySelector(`.event__input--destination`)
        .addEventListener(`change`, this._destinationToggleHandler);

    element
      .querySelectorAll(`.event__input--time`)
      .forEach((input) => {
        this._initDatepicker(input, input.dataset.time);
      });

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

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: Math.round(evt.target.value)
    });

  }

  _initDatepicker(element, name) {
    const options = {
      "time_24hr": true,
      "enableTime": true,
      "minuteIncrement": 1,
      "dateFormat": `d/m/y H:i`,
      "defaultDate": this._data[name] || `today`,
    };

    if (name === `start`) {
      this._datepickerStart = flatpickr(element,
          Object.assign({}, options, {
            onChange: ([date]) => {
              this._dateChangeHandler(`start`, date);
              if (this._data.start > this._data.end) {
                this._dateChangeHandler(`end`, date);
              }
              this._datepickerEnd.set(`minDate`, this._data.start);
            },
          })
      );
    }

    if (name === `end`) {
      this._datepickerEnd = flatpickr(element,
          Object.assign({}, options, {
            "minDate": this._data.start,
            "onChange": ([date]) => {
              this._dateChangeHandler(`end`, date);
            },
          })
      );
    }
  }

  _dateChangeHandler(name, value) {
    this.updateData({
      [name]: value
    });
  }

  _removeDatePickers() {
    if (this._datepickerStart || this._datepickerEnd) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
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

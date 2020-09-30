import SmartView from "../smart/smart.js";
import he from "he";
import flatpickr from "flatpickr";
import "../../../node_modules/flatpickr/dist/flatpickr.min.css";

import {capitalizeString} from "../../utils/utils.js";


import {
  BLANK_POINT,
  PointType,
} from "../../const.js";

import {createDetailsTemplate} from './templates/create-details-template.js';
import {createFavoriteTemplate} from './templates/create-favorite-template.js';
import {createTimeTemplate} from './templates/create-time-template.js';

const isOfferInclude = (offers, currentOffer) =>
  offers.some((offer) => (
    offer.title === currentOffer.title && offer.price === currentOffer.price
  ));

const convertOffers = (offers, renderedOffers) =>
  offers.map((offer) => {
    return {
      title: offer.title,
      price: offer.price,
      isChecked: renderedOffers.length > 0 && isOfferInclude(renderedOffers, offer),
    };
  });

const getRenderedPoints = (renderedOffers) => renderedOffers.reduce((offers, offer) => {
  if (offer.isChecked) {
    offers.push({
      title: offer.title,
      price: Number(offer.price),
    });
  }
  return offers;
}, []);

const createPointFormTemplate = (data, destinations, isNewPoint = false) => {

  const {
    id,
    waypoint,
    price,
    info,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  const [ACTIVITY, TRANSFER] = Object.keys(PointType);

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

  const createDesctinationList = (list) => (
    `<datalist id="destination-list-${id}">
      ${list.map(({name}) => `<option value="${name}"></option>`).join(``)}
    </datalist>`
  );

  const pointTypeList = () => (`
    <div class="event__type-list">
      ${createPoints(TRANSFER, PointType.TRANSFER, waypoint)}
      ${createPoints(ACTIVITY, PointType.ACTIVITY, waypoint)}
    </div>`
  );

  const pointTypeWrapper = (`
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17"
          src="img/icons/${waypoint}.png" alt="${waypoint} icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">
      ${pointTypeList()}
    </div>`
  );

  const pointDestinationTemplate = (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${capitalizeString(waypoint)}${PointType.TRANSFER.includes(capitalizeString(waypoint)) ? ` to` : ` in`}
      </label>
      <input class="event__input  event__input--destination"
        id="event-destination-${id}" type="text" name="event-destination"
        value="${he.encode(info.name)}" list="destination-list-${id}" required>
      ${createDesctinationList(destinations)}
    </div>`
  );

  const pointPriceTemplate = (
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>€
      </label>
      <input class="event__input event__input--price"
        id="event-price-${id}" type="number" min="0" step="1" maxlength="4" name="event-price" value="${he.encode(String(price))}" required>
    </div>`
  );

  const createFormTemplate = () => (
    `<form class="trip-events__item event event--edit ${isDisabled ? `event--disabled` : ``}" action="#" method="post">
        <header class="event__header">
          ${pointTypeWrapper}
          ${pointDestinationTemplate}
          ${createTimeTemplate(data)}
          ${pointPriceTemplate}
          <button class="event__save-btn btn btn--blue" type="submit"}>
            ${isSaving ? `Saving…` : `Save`}
          </button>
          <button class="event__reset-btn" type="reset">
            ${(!isNewPoint) ? `
              ${isDeleting ? `Deleting…` : `Delete`}
              ` : `Cancel`}
          </button>
          ${(!isNewPoint) ? `${createFavoriteTemplate(isFavorite)}` : ``}
          ${(!isNewPoint) ? `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ``}
        </header>
        ${createDetailsTemplate(data)}
    </form>`
  );

  return `<li class="trip-events__item">${createFormTemplate()}</li>`;
};

export default class PointForm extends SmartView {

  constructor(point = BLANK_POINT, destinations, offers, isNewPoint = false) {
    super();

    this._data = PointForm.parsePointToData(point);
    this._destinations = destinations;
    this._offers = offers;

    this._isNewPoint = isNewPoint;


    this._onSubmitHandler = this._onSubmitHandler.bind(this);
    this._onCloseClickHandler = this._onCloseClickHandler.bind(this);
    this._onFavoriteClickHandler = this._onFavoriteClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

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
    if (!this._isNewPoint) {
      this.setFavoriteClickHandler(this._onFavoriteClick);
      this.setCloseButtonHandler(this._onCloseClick);
    }

    this.setFormSubmitHandler(this._onSubmit);
    this.setDeletePointHandler(this._onDeleteClick);
    this._setInnerHandlers();
  }

  getTemplate() {
    return (!this._isNewPoint) ?
      createPointFormTemplate(this._data, this._destinations)
      :
      createPointFormTemplate(this._data, this.destinations, true);
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

    element.querySelectorAll(`.event__type-input`).forEach((input) => {
      input.addEventListener(`change`, this._typeToggleHandler);
    });

    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationToggleHandler);

    element.querySelectorAll(`.event__input--time`).forEach((input) => {
      this._initDatepicker(input, input.dataset.time);
    });

    element.querySelectorAll(`.event__offer-checkbox`).forEach((offer) => {
      offer.addEventListener(`change`, this._offerChangeHandler);
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

    this.updateData({
      isFavorite: evt.target.checked
    });

    this._onFavoriteClick(PointForm.parseDataToPoint(this._data));
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    const {title, price} = evt.target.dataset;

    const renderedOffers = this._data.renderedOffers.map((offer) => {
      if (offer.title !== title && offer.price !== Number(price)) {
        return offer;
      }
      return {
        title,
        price,
        isChecked: evt.target.checked
      };
    });

    this.updateData({
      renderedOffers
    }, true);

  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const {value, list} = evt.target;
    const isDestination = [...list.options].some((opt) => opt.value === value);

    if (!isDestination) {
      return;
    }

    const choisedDestintation = this._destinations.filter((desct) => desct.name === value);
    const {name, description, pictures} = choisedDestintation[0];

    this.updateData({
      info: {
        name,
        description,
        pictures,
      }
    });
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    const waypointOffers = this._offers[evt.target.value];

    const renderedOffers = waypointOffers.length > 0
      ? convertOffers(waypointOffers, [])
      : [];

    this.updateData({
      waypoint: capitalizeString(evt.target.value),
      renderedOffers
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const {value} = evt.target;
    if (!value) {
      return;
    }

    this.updateData({
      price: Math.round(evt.target.value)
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._onDeleteClick(PointForm.parseDataToPoint(this._data));
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
            minDate: this._data.start,
            onChange: ([date]) => {
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

  static parsePointToData(point) {
    const {waypoint} = point;
    console.log(this._offers);
    const waypointOffers = this._offers[waypoint];

    const renderedOffers = (waypointOffers && waypointOffers.length > 0)
      ? convertOffers(waypointOffers, point.offers)
      : [];

    return Object.assign({}, point, {
      renderedOffers,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data, {
      offers: getRenderedPoints(data.renderedOffers),
    });

    delete data.renderedOffers;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

}

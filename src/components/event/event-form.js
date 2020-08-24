import SmartView from "../smart.js";
import {CITY_LIST, BLANK_ROUTE} from "../../const.js";
import {getTimeFormat, formatDateToPlaceholder} from "../../utils/utils.js";
import {createTripOffersTemplate} from "./event-offers.js";
import {createTripDetailsTemplate} from "./event-details.js";
import {createTripCityListTemplate} from "./event-city-list.js";
import {createTripWaypointTemplate} from "./event-waypoint.js";
import {createEventTimeGroupTemplate} from "./event-time.js";
import {createEventPriceTemplate} from "./event-price.js";

const createEventFormTemplate = (data) => {
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
        ${(hasOffers) ? createTripOffersTemplate(offers) : ``}
        ${(hasInfo) ? createTripDetailsTemplate(info) : ``}
     </section>` : ``}
  </form>
  </li>`;
};


export default class EventForm extends SmartView {

  constructor(route = BLANK_ROUTE) {
    super();
    this._data = EventForm.parseRouteToData(route);


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
    return createEventFormTemplate(this._data);
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
    this._onSubmit(EventForm.parseDataToTask(this._data));
  }

  _onCloseClickHandler() {
    this._onSubmit(EventForm.parseDataToTask(this._data));
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

    if (isDestination) {
      this.updateData({
        destination: evt.target.value
      });
    } else {
      return;
    }

  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    const updatedWaypoint = evt.target.value[0].toUpperCase() + evt.target.value.slice(1);
    this.updateData({
      waypoint: updatedWaypoint,
    });
  }

  static parseRouteToData(route) {
    return Object.assign({}, route, {
      waypoint: route.waypoint,
    });
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);
    return data;
  }


}


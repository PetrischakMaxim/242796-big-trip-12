import SmartView from "../smart.js";
import {CITY_LIST, BLANK_ROUTE} from "../../const.js";
import {getTimeFormat, formatDateToPlaceholder} from "../../utils/utils.js";
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
    hasOffers,
    hasInfo,
    isFavorite,
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
      <button class="event__reset-btn" type="reset">Delete</button>
      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden"
        type="checkbox" name="event-favorite" ${(isFavorite) ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1"><span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg></label>
        <button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>
    </header>
    ${createTripEventsTemplate()}
  </form>
  </li>`;
};


export default class EventForm extends SmartView {

  constructor(route) {
    super();
    this._route = route || BLANK_ROUTE;
    this._formCloseHandler = null;
    this._favoriteClickHandler = null;
    this._buttonCloseHandler = null;

    this._onSubmit = this._onSubmit.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  getTemplate() {
    return createEventFormTemplate(this._route);
  }

  setFormSubmitHandler(callback) {
    this._formCloseHandler = callback;
    this.getElement()
      .querySelector(`.event`)
      .addEventListener(`submit`, this._onSubmit);
  }

  setCloseButtonHandler(callback) {
    this._buttonCloseHandler = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onCloseClick);
  }

  setfavoriteClickHandler(callback) {
    this._favoriteClickHandler = callback;
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, this._onFavoriteClick);
  }

  _onSubmit(evt) {
    evt.preventDefault();
    this._formCloseHandler(this._route);
  }

  _onCloseClick() {
    this._formCloseHandler(this._route);
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    this._favoriteClickHandler();
  }

}


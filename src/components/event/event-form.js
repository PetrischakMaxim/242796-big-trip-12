import {CITY_LIST} from "../../const.js";
import {getRandomInteger, getTimeFormat, formatDateToPlaceholder} from "../../utils.js";

const createTripOffersTemplate = (offers) => {
  const offersTemplate = offers.map(({name, cost})=> {
    const offerType = name.split(` `).pop();
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerType}-1"
    type="checkbox" name="event-offer-${offerType}" ${getRandomInteger(0, 1) ? `checked` : ``} >
    <label class="event__offer-label" for="event-offer-${offerType}-1">
      <span class="event__offer-title">${name}</span>
      +
      €&nbsp;<span class="event__offer-price">${cost}</span>
    </label>
  </div>`;
  }).join(``);

  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
          ${offersTemplate}
      </div>
    </section>`;
};

const createTripDetailsTemplate = (info) => {
  const {description, images} = info;
  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
            ${images.map((url)=> `<img class="event__photo" src="${url}" alt="Event photo"/>`).join(``)}
        </div>
      </div>
    </section>`;
};

const createTripCityListTemplate = (cities) => cities.map((city) => `<option value="${city}"></option>`).join(``);

const createTripWaypointTemplate = (type, waypoints, currentPoint) => {
  const waypointTemplate = waypoints.map((waypoint) => {
    const waypointName = waypoint.toLowerCase();
    return `<div class="event__type-item">
       <input id="event-type-${waypointName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
        value="${waypointName}" ${(waypoint === currentPoint) ? `checked` : ``}>
       <label class="event__type-label event__type-label--${waypointName}" for="event-type-${waypointName}-1">${waypoint}</label>
    </div>`;
  }).join(``);
  return `<fieldset class="event__type-group">
    <legend class="visually-hidden">${type}</legend>
      ${waypointTemplate}
    </fieldset>`;
};

export const createTripEventForm = (route) => {

  const {
    waypoint,
    waypointTypes,
    waypointTypes: {
      transfer,
      activity,
    },
    cost,
    destination,
    offers,
    info,
    tripDates: {
      start,
      end,
    },
    isOffers,
    isInfo,
  } = route;

  const createTripEventsTemplate = () => {
    return (isOffers || isInfo) ?
      `<section class="event__details">
        ${createTripOffersTemplate(offers)}
        ${createTripDetailsTemplate(info)}
      </section>`
      :
      ``;
  };

  const [transferType, activityType] = Object.keys(waypointTypes);
  const startDate = `${formatDateToPlaceholder(start)} ${getTimeFormat(start)}`;
  const endDate = `${formatDateToPlaceholder(end)} ${getTimeFormat(end)}`;

  return `
  <form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
            ${createTripWaypointTemplate(transferType, transfer, waypoint)}
            ${createTripWaypointTemplate(activityType, activity, waypoint)}
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${waypoint}${transfer.includes(waypoint) ? ` to` : ` in`}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        <datalist id="destination-list-1">
            ${createTripCityListTemplate(CITY_LIST)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
        —
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    ${createTripEventsTemplate()}
  </form>`;

};



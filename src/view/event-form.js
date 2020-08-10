import {CITY_LIST, OFFER_LIST, TRIP_IMAGE_URL, TRIP_SENTENCE} from "../const.js";
import {getRandomInteger} from "../utils.js";


const generateSentence = (maxLength = 5) => {
  const sentenceQuantity = getRandomInteger(1, maxLength);
  return TRIP_SENTENCE.repeat(sentenceQuantity);
};

const generateImage = (maxLength = 5) => {
  const imagesQuantity = getRandomInteger(1, maxLength);
  const imagesList = new Array(imagesQuantity).fill().map(()=> {
    const imageParam = getRandomInteger(1, 10);
    return `${TRIP_IMAGE_URL}${imageParam}`;
  });

  return [...new Set(imagesList)];
};


const createTripOffersTemplate = () => {
  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked="">
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">Add luggage</span>
            +
            €&nbsp;<span class="event__offer-price">30</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked="">
          <label class="event__offer-label" for="event-offer-comfort-1">
            <span class="event__offer-title">Switch to comfort class</span>
            +
            €&nbsp;<span class="event__offer-price">100</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
          <label class="event__offer-label" for="event-offer-meal-1">
            <span class="event__offer-title">Add meal</span>
            +
            €&nbsp;<span class="event__offer-price">15</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
          <label class="event__offer-label" for="event-offer-seats-1">
            <span class="event__offer-title">Choose seats</span>
            +
            €&nbsp;<span class="event__offer-price">5</span>
          </label>
        </div>
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
          <label class="event__offer-label" for="event-offer-train-1">
            <span class="event__offer-title">Travel by train</span>
            +
            €&nbsp;<span class="event__offer-price">40</span>
          </label>
        </div>
      </div>
    </section>`;
};

const createDescriptionImageTemplate = (images = generateImage()) => {
  return images.map((imageUrl)=> `<img class="event__photo" src="${imageUrl}" alt="Event photo"/>`).join(``);
};

const createDescriptionTemplate = (description = generateSentence()) => `<p class="event__destination-description">${description}</p>`;

const createTripDetailsTemplate = () => {
  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDescriptionTemplate()}
      <div class="event__photos-container">
        <div class="event__photos-tape">
            ${createDescriptionImageTemplate()}
        </div>
      </div>
    </section>`;
};

const createTripCityListTemplate = (cities) => cities.map((city) => `<option value="${city}"></option>`).join(``);

const createTripWaypointTemplate = (type, waypoints) => {
  const waypointTemplate = waypoints.map((waypoint) => {
    const waypointName = waypoint.toLowerCase();
    return `<div class="event__type-item">
       <input id="event-type-${waypointName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${waypointName} ">
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
    isDestinationInfo} = route;

  const [transferType, activityType] = Object.keys(waypointTypes);

  return `
  <form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${waypoint}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
            ${createTripWaypointTemplate(transferType, transfer)}
            ${createTripWaypointTemplate(activityType, activity)}
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${waypoint} to
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
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
        —
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
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
  </form>
  <section class="event__details">
    ${createTripOffersTemplate()}
    ${isDestinationInfo ? createTripDetailsTemplate() : `` }

  </section>`;
};



import {OFFER_LIST} from "../const.js";
import {getRandomInteger, getRandomIndex} from "../utils.js";

const createOffersTemplate = (offer) => {
  const {offerName, offerPrice} = offer;
  const offersTemplate = `<li class="event__offer">
    <span class="event__offer-title">${offerName}</span>
     +
     €&nbsp;<span class="event__offer-price">${offerPrice}</span>
 </li>`;

  return `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">${offersTemplate}</ul>`;
};

export const createEventItem = (route) => {

  const {
    waypoint,
    waypointTypes: {
      transfer,
    },
    destination,
    cost,
    isOffers,
  } = route;

  let offerList = ``;
  if (isOffers) {
    route.offers = {
      offerName: getRandomIndex(OFFER_LIST),
      offerPrice: getRandomInteger(20, 50),
    };
    offerList = createOffersTemplate(route.offers);
  }

  return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${waypoint} ${transfer.includes(waypoint) ? ` to` : ` in`} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
        —
        <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
      </p>
      <p class="event__duration">30M</p>
    </div>
    <p class="event__price">
      €&nbsp;<span class="event__price-value">${cost}</span>
    </p>
    ${offerList}
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

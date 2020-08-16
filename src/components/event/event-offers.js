import {getRandomInteger} from "../../utils/utils.js";

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

export const createTripOffersTemplate = (offers) => {
  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
          ${generateOffersTemplate(offers)}
      </div>
  </section>`;
};

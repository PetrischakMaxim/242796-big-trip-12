const offersTemplate = (offers) => {
  return offers.map((offer) => {
    const {name, cost} = offer;
    return `
    <li class="event__offer">
      <span class="event__offer-title">${name}</span>
        +
      €&nbsp;<span class="event__offer-price">${cost}</span>
    </li>`;
  }).join(``);
};

export const createOffersTemplate = (offers) => {
  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersTemplate(offers)}
    </ul>
  `;
};

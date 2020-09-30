import {createOffersTemplate} from './create-offers-template.js';
import {createInfoTemplate} from './create-info-template.js';

export const createDetailsTemplate = (pointData) => {
  const {info, renderedOffers} = pointData;

  return (
    `<section class="event__details">
      ${renderedOffers.length > 0 ? createOffersTemplate(renderedOffers) : ``}
      ${info.name !== `` ? createInfoTemplate(info) : ``}
    </section>`
  );
};

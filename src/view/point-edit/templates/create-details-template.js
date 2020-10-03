import {createOffersTemplate} from './create-offers-template.js';
import {createDestinationTemplate} from './create-destination-template.js';

export const createDetailsTemplate = (pointData) => {
  const {destination, renderedOffers, isDisabled} = pointData;

  return (
    `<section class="event__details">
      ${renderedOffers.length > 0 ? createOffersTemplate(renderedOffers, isDisabled) : ``}
      ${destination.name !== `` ? createDestinationTemplate(destination) : ``}
    </section>`
  );
};

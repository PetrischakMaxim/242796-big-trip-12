import {createOffersTemplate} from './create-offers-template';
import {createDestinationTemplate} from './create-destination-template';

export const createDetailsTemplate = (pointData) => {
  const {destination, renderedOffers, isDisabled} = pointData;

  return (
    `<section class="event__details">
      ${renderedOffers.length > 0 ? createOffersTemplate(renderedOffers, isDisabled) : ``}
      ${destination.name !== `` ? createDestinationTemplate(destination) : ``}
    </section>`
  );
};

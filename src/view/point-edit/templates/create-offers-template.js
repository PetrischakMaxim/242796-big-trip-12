export const createOffersTemplate = (renderedOffers, isDisabled) => {

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">
        Offers
      </h3>
      <div class="event__available-offers">
        ${renderedOffers
          .map((offer, index) => {
            const {title, price} = offer;

            return (
              `<div class="event__offer-selector">
                <input
                  class="event__offer-checkbox visually-hidden"
                  id="event-offer-${index}"
                  data-title="${title}"
                  data-price="${price}"
                  type="checkbox" name="event-offer-${index}"
                  ${offer.isActivated ? `checked` : ``}
                  ${isDisabled ? `disabled` : ``}
                >
                 <label class="event__offer-label" for="event-offer-${index}">
                  <span class="event__offer-title">
                    ${title}
                  </span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">
                    ${price}
                 </span>
                </label>
              </div>`
            );
          })
          .join(``)}
      </div>
    </section>`
  );
};

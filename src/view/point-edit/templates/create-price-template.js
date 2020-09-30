export const createPriceTemplate = (price, isDisabled) => {
  return (
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input
        class="event__input  event__input--price"
        id="event-price-1"
        type="number"
        min="0"
        step="1"
        required
        name="event-price"
        value="${price}"
        ${isDisabled ? `disabled` : ``}
      >
    </div>`
  );
};

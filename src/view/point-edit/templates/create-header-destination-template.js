import {getPointTypeWithPreposition} from '../../../utils/type-preposition-utils.js';

export const createHeaderDestinationTemplate = (currentType, destination, destinations, isDisabled) => {

  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${getPointTypeWithPreposition(currentType)}
      </label>
      <input
        class="event__input  event__input--destination"
        id="event-destination-1" type="text" name="event-destination"
        value="${destination.name}"
        list="destination-list-1"
        ${isDisabled ? `disabled` : ``}
      >
      <datalist id="destination-list-1">
        ${destinations
          .map((item) => `<option value="${item.name}"></option>`)
          .join(``)}
      </datalist>
    </div>`
  );
};

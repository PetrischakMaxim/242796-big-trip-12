import {pointGroupToTypes} from '../../../const';

const groupTypes = Object.entries(pointGroupToTypes);

const createTypeGroupTemplate = (groupName, types, currentType) => {

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${groupName}</legend>
      ${types
        .map((type, i) => {
          const id = type.toLowerCase();

          return (
            `<div class="event__type-item">
            <input
              id="event-type-${id}-${i}"
              class="event__type-input  visually-hidden"
              type="radio"
              name="event-type"
              value="${type}"
              ${id === currentType ? `checked` : ``}
            >
            <label
              class="event__type-label event__type-label--${id}"
              for="event-type-${id}-${i}"
            >
              ${type}
            </label>
          </div>`
          );
        })
        .join(``)}
    </fieldset>`
  );
};

export const createTypeListTemplate = (currentType, isDisabled) => {
  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img
          class="event__type-icon"
          width="17"
          height="17"
          src="img/icons/${currentType}.png"
          alt="Event type icon"
        >
      </label>
      <input
        class="event__type-toggle
        visually-hidden"
        id="event-type-toggle-1"
        type="checkbox"
        ${isDisabled ? `disabled` : ``}
      >
      <div class="event__type-list">
        ${groupTypes
          .map(([groupName, types]) => createTypeGroupTemplate(groupName, types, currentType))
          .join(``)}
      </div>
    </div>`
  );
};


import {createTypeListTemplate} from './create-type-list-template.js';
import {createHeaderDestinationTemplate} from './create-header-destination-template.js';
import {createTimeTemplate} from './create-time-template.js';
import {createPriceTemplate} from './create-price-template.js';
import {createSaveButtonTemplate} from './create-save-button-template.js';
import {createResetButtonTemplate} from './create-reset-button-template.js';
import {createFavoriteTemplate} from './create-favorite-template.js';
import {createRollupButtonTemplate} from './create-rollup-button-template.js';

export const createHeaderTemplate = (pointData, destinations, isAddMode) => {

  const {
    type,
    destination,
    start,
    end,
    price,
    isFavorite,
    isDestinationError,
    isDisabled,
    isSaving,
    isDeleting,
  } = pointData;

  const isDisabledSaveButton = isDestinationError || isDisabled;

  return (
    `<header class="event__header">
      ${createTypeListTemplate(type, isDisabled)}
      ${createHeaderDestinationTemplate(type, destination, destinations, isDisabled)}
      ${createTimeTemplate({start, end, isDisabled})}
      ${createPriceTemplate(price, isDisabled)}
      ${createSaveButtonTemplate(isDisabledSaveButton, isSaving)}
      ${createResetButtonTemplate(isAddMode, isDeleting, isDisabled)}
      ${isAddMode ? `` : createFavoriteTemplate(isFavorite, isDisabled)}
      ${isAddMode ? `` : createRollupButtonTemplate(isDisabled)}
    </header>`
  );
};

const FAVORITE_ICON = (
  `<svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z">
      </path>
  </svg>`
);

export const createFavoriteTemplate = (isFavorite, isDisabled) => {
  return (
    `<input
      id="event-favorite-1"
      class="event__favorite-checkbox  visually-hidden"
      type="checkbox" name="event-favorite"
      ${isFavorite ? `checked` : ``}
      ${isDisabled ? `disabled` : ``}
    >
      <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      ${FAVORITE_ICON}
    </label>`
  );
};

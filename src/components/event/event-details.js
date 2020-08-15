const getTripPhotoTape = (images) => {
  return `<div class="event__photos-tape">
    ${images.map((url)=> `<img class="event__photo" src="${url}" alt="Event photo"/>`).join(``)}
  </div>`;
};

export const createTripDetailsTemplate = (info) => {
  const {description, images} = info;
  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">
        Destination
      </h3>
      <p class="event__destination-description">
        ${description}
      </p>
      <div class="event__photos-container">
        ${getTripPhotoTape(images)}
      </div>
    </section>`;
};


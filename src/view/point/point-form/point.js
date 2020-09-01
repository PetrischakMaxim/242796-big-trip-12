const pointTemlate = (point, currentPoint) => (
  `<div class="event__type-item">
    <input id="event-type-${point.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
    value="${point.toLowerCase()}"
    ${(point === currentPoint) ? `checked` : ``}>
    <label class="event__type-label event__type-label--${point.toLowerCase()}"
    for="event-type-${point.toLowerCase()}-1">${point}</label>
  </div>`
);


export const createPointTemplate = (type, points, currentPoint) => (
  `<fieldset class="event__type-group">
      <legend class="visually-hidden">${type}</legend>
        ${Array.isArray(points) ? points.map((point) => pointTemlate(point, currentPoint)).join(``) : ``}
  </fieldset>`
);

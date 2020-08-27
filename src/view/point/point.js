const generatePointTemplate = (points, currentPoint) => {
  return points.map((point) => {
    const pointName = point.toLowerCase();
    return `<div class="event__type-item">
       <input id="event-type-${pointName}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${pointName}"
        ${(point === currentPoint) ? `checked` : ``}>
       <label class="event__type-label event__type-label--${pointName}"
        for="event-type-${pointName}-1">${point}</label>
    </div>`;
  }).join(``);
};

export const createPointTemplate = (type, points, currentPoint) => {
  return `<fieldset class="event__type-group">
    <legend class="visually-hidden">${type}</legend>
      ${generatePointTemplate(points, currentPoint)}
    </fieldset>`;
};

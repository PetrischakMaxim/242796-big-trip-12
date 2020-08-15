
const waypointTemplate = (waypoints, currentPoint) => {
  return waypoints.map((waypoint) => {
    const waypointName = waypoint.toLowerCase();
    return `<div class="event__type-item">
       <input id="event-type-${waypointName}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${waypointName}"
        ${(waypoint === currentPoint) ? `checked` : ``}>
       <label class="event__type-label event__type-label--${waypointName}"
        for="event-type-${waypointName}-1">${waypoint}</label>
    </div>`;
  }).join(``);
};

export const createTripWaypointTemplate = (type, waypoints, currentPoint) => {
  return `<fieldset class="event__type-group">
    <legend class="visually-hidden">${type}</legend>
      ${waypointTemplate(waypoints, currentPoint)}
    </fieldset>`;
};

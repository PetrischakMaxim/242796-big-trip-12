import {getFormatedDate} from '../../utils.js';

export const createTripInfo = (routes) => {
  const startRoute = routes[0].destination;
  const middleRoute = routes[Math.floor(routes.length) / 2].destination;
  const endRoute = routes[routes.length - 1].destination;
  const startDate = getFormatedDate(routes[0].tripDates.start);
  const endDate = getFormatedDate(routes[routes.length - 1].tripDates.end);
  const totalCost = routes.map((route)=> route.cost).reduce((total, current) => total + current, 0);

  return `
  <section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${startRoute} — ${middleRoute} — ${endRoute}</h1>
    <p class="trip-info__dates">${startDate}&nbsp;—&nbsp;${endDate}</p>
  </div>
  <p class="trip-info__cost">
    Total: €&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
  </p>
</section>`;
};

export const createTotalCostInfo = (routes) => {
  const totalCost = routes
    .map((route)=> route.cost)
    .reduce((total, current) => total + current, 0);

  return `<p class="trip-info__cost">
    Total: €&nbsp;
    <span class="trip-info__cost-value">
      ${totalCost}
    </span>
  </p>`;
};

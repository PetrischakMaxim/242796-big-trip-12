export const createTotalCostInfoTemplate = (points) => {

  const getTotalCost = points
    .map((point)=> point.cost)
    .reduce((total, current) => total + current, 0);

  return `<p class="trip-info__cost">
    Total: €&nbsp;
    <span class="trip-info__cost-value">
      ${getTotalCost}
    </span>
  </p>`;
};

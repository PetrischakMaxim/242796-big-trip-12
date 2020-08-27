export const createCityListTemplate = (cities) => (
  `<datalist id="destination-list-1">
    ${cities.map((city) => `<option value="${city}"></option>`).join(``)}
  </datalist>
  `
);

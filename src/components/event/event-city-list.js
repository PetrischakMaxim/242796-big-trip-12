const cityList = (cities) => {
  return cities.map((city) => `<option value="${city}"></option>`).join(``);
};

export const createTripCityListTemplate = (cities) => {
  return `
    <datalist id="destination-list-1">
        ${cityList(cities)}
    </datalist>
  `;
};


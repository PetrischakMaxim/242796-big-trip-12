const generateCityList = (cities) => {
  return cities.map((city) => `<option value="${city}"></option>`).join(``);
};

export const createCityListTemplate = (cities) => {
  return `
  <datalist id="destination-list-1">
        ${generateCityList(cities)}
    </datalist>
  `;
};


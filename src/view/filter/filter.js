import AbstractView from "../abstract/abstract.js";


const createFilter = (filter, currentFilterType) => {
  const {type, name} = filter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden"
      type="radio" name="trip-filter" value="everything"  ${type === currentFilterType ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
  </div>`
  );
};

export const createFilterFormTemplate = (filters, currentFilterType) => (
  `<div class="trip-filters-wrapper">
   <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter)=> createFilter(filter, currentFilterType)).join(``)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`
);

export default class Filter extends AbstractView {

  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._filterTypeChange = null;
  }

  getTemplate() {
    return createFilterFormTemplate(this._filters, this.__currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._filterTypeChange(evt.target.value);
  }

}

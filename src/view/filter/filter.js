import AbstractView from "../abstract/abstract.js";

const createFilter = (filter, currentFilterType) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden"
      type="radio" name="trip-filter" value="${filter.type}" ${filter.type === currentFilterType ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
  </div>`
);

const createFiltersTemplate = (filters, currentFilterType) => (
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
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._filterTypeChange = callback;
    this.getElement()
      .querySelectorAll(`.trip-filters__filter-input`)
      .forEach((filter)=> filter.addEventListener(`change`, this._filterTypeChangeHandler));
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._filterTypeChange(evt.target.value);
  }

}

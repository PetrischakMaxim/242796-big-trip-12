import AbstractView from '../abstract/abstract.js';
import {FilterType} from '../../const.js';

const FILTERS = Object.values(FilterType);

const createFiltersTemplate = (activeFilter, filtersStatus) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${FILTERS
        .map((filter) => {
          const key = filter.toLowerCase();
          return (
            `<div class="trip-filters__filter">
              <input
                id="filter-${key}"
                class="trip-filters__filter-input  visually-hidden"
                type="radio"
                name="trip-filter"
                value="${filter}"
                ${filter === activeFilter ? `checked` : ``}
                ${filtersStatus[filter] ? `` : `disabled`}
              >
              <label class="trip-filters__filter-label" for="filter-${key}">
                ${filter}
              </label>
            </div>`
          );
        })
        .join(``)}
      <button class="visually-hidden" type="submit">
        Accept filter
      </button>
    </form>`
  );
};

export default class Filters extends AbstractView {
  constructor(activeFilter, filtersStatus) {
    super();
    this._filtersStatus = filtersStatus;
    this._activeFilter = activeFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._filterTypeChange = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._activeFilter, this._filtersStatus);
  }

  setChangeHandler(callback) {
    this._filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._filterTypeChange(evt.target.value);
  }
}

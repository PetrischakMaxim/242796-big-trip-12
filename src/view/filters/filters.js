import AbstractView from '../abstract/abstract.js';
import {FilterType} from '../../const.js';

const FILTERS = Object.values(FilterType);

const createFiltersTemplate = (active, status) => {
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
                ${filter === active ? `checked` : ``}
                ${status[filter] ? `` : `disabled`}
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

  constructor(active, status) {
    super();
    this._status = status;
    this._active = active;
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._typeChange = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._active, this._status);
  }

  setChangeHandler(callback) {
    this._typeChange = callback;
    this.getElement().addEventListener(`change`, this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._typeChange(evt.target.value);
  }
}

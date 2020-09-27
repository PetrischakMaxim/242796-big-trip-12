import {FilterView} from "../view/index.js";
import {render, replace, remove} from "../utils/dom-utils.js";
import {FilterType, UpdateType} from "../const.js";

export default class Filter {

  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._currentFilter = null;
    this._filterView = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterView;

    this._filterView = new FilterView(filters, this._currentFilter);
    this._filterView.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterView);
      return;
    }

    replace(this._filterView, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: `everything`,
      },
      {
        type: FilterType.FUTURE,
        name: `future`,
      },
      {
        type: FilterType.PAST,
        name: `past`,
      },
    ];
  }
}

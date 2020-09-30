import FiltersView from '../../view/filters/filters.js';

import {
  render,
  RenderPosition,
  replace, remove,
} from '../../utils/dom-utils';

import {filter} from '../../utils/filter-utils.js';
import {getElement} from '../../utils/dom-utils';
import {UpdateType, FilterType} from '../../const';

const {
  BEFORE_END,
} = RenderPosition;

export default class Filter {
  constructor(filterContainer, tripModel, filterModel) {
    this._filterContainerElement = getElement(filterContainer);
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._currentFilter = null;

    this._filterView = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._tripModel.add(this._modelEventHandler);
    this._filterModel.add(this._modelEventHandler);
  }

  init() {
    this._currentFilter = this._filterModel.get();
    const prevFilterView = this._filterView;
    const points = this._tripModel.getPoints();
    const filtersStatus = {
      [FilterType.EVERYTHING]: points.length > 0,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points).length > 0,
      [FilterType.PAST]: filter[FilterType.PAST](points).length > 0,
    };

    this._filterView = new FiltersView(this._currentFilter, filtersStatus);
    this._filterView.setChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterView === null) {
      render(this._filterContainerElement, this._filterView, BEFORE_END);
      return;
    }

    replace(this._filterView, prevFilterView);
    remove(prevFilterView);
  }

  _modelEventHandler() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}

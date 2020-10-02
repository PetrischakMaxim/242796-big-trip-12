import StatsView from '../../view/stats/stats.js';

import {
  render,
  RenderPosition,
  remove,
  getElement,
} from '../../utils/dom-utils';

import {FilterType, TabItem} from '../../const';
import {filter} from '../../utils/filter-utils';

export default class Stats {
  constructor(container, tripModel, filterModel, mode) {
    this._containerElement = getElement(container);
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._mode = mode;

    this._view = null;
    this._modelEventHandler = this._modelEventHandler.bind(this);
  }

  init() {
    this._tripModel.add(this._modelEventHandler);
    this._filterModel.add(this._modelEventHandler);

    if (this._mode === TabItem.STATS) {
      const points = this._tripModel.getPoints();
      const filterType = this._filterModel.get();

      const filteredPoints = filterType === FilterType.EVERYTHING
        ? points
        : filter[filterType](points);

      this._clear();
      this._view = new StatsView(filteredPoints);
      render(this._containerElement, this._view, RenderPosition.BEFORE_END);
    }
  }

  destroy() {
    this._clear();

    this._tripModel.remove(this._modelEventHandler);
    this._filterModel.remove(this._modelEventHandler);
  }

  changeMode(mode) {
    this._mode = mode;
  }

  _clear() {
    if (this._view !== null) {
      remove(this._view);
      this._view = null;
    }
  }

  _modelEventHandler() {
    this.init();
  }
}

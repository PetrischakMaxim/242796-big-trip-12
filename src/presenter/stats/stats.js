import StatsView from '../../view/stats/stats.js';

import {
  render,
  RenderPosition,
  remove,
  getElement,
} from '../../utils/dom-utils';

import {FilterType, TabItem} from '../../const';
import {filter} from '../../utils/filter-utils';

const {
  BEFORE_END,
} = RenderPosition;

export default class Statistics {
  constructor(statisticsContainer, tripModel, filterModel, mode) {
    this._statisticsContainerElement = getElement(statisticsContainer);
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._mode = mode;

    this._statisticsView = null;

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
      this._statisticsView = new StatsView(filteredPoints);
      render(this._statisticsContainerElement, this._statisticsView, BEFORE_END);
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
    if (this._statisticsView !== null) {
      remove(this._statisticsView);
      this._statisticsView = null;
    }
  }

  _modelEventHandler() {
    this.init();
  }
}

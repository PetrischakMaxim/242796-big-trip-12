import FiltersView from '../../view/filters/filters.js';

import {
  render,
  RenderPosition,
  replace, remove,
} from '../../utils/dom-utils';

import {filter} from '../../utils/filter-utils.js';
import {getElement} from '../../utils/dom-utils';
import {UpdateType, FilterType} from '../../const';

export default class Filter {

  constructor(container, tripModel, filterModel) {
    this._containerElement = getElement(container);
    this._tripModel = tripModel;
    this._model = filterModel;
    this._current = null;

    this._view = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);

    this._tripModel.add(this._modelEventHandler);
    this._model.add(this._modelEventHandler);
  }

  init() {
    this._current = this._model.get();
    const prevView = this._view;
    const points = this._tripModel.getPoints();
    const filtersStatus = {
      [FilterType.EVERYTHING]: points.length > 0,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points).length > 0,
      [FilterType.PAST]: filter[FilterType.PAST](points).length > 0,
    };

    this._view = new FiltersView(this._current, filtersStatus);
    this._view.setChangeHandler(this._typeChangeHandler);

    if (prevView === null) {
      render(this._containerElement, this._view, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._view, prevView);
    remove(prevView);
  }

  _modelEventHandler() {
    this.init();
  }

  _typeChangeHandler(filterType) {
    if (this._current === filterType) {
      return;
    }

    this._model.set(UpdateType.MAJOR, filterType);
  }
}

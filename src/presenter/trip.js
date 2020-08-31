import SortView from "../view/sort/sort.js";
import DayListView from "../view/day/day-list.js";
import DayView from "../view/day/day.js";
import NoPointView from "../view/point/no-point.js";
import PointPresenter from "./point.js";

import {render, remove} from "../utils/dom-utils.js";
import {sortPrice, sortDate} from "../utils/utils.js";
import {SortType, UpdateType, UserAction} from "../const.js";

export default class Trip {

  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);

    this._sortView = null;
    this._dayListView = new DayListView();
    this._noPointView = new NoPointView();
    this._currentSortType = SortType.DEFAULT;
    this._pointPresenter = new Map();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    switch (this._currentSortType) {

      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortDate);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortPrice);

    }

    return this._pointsModel.getPoints();
  }

  _handleModeChange() {
    this._pointPresenter
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        for (let index of this._pointPresenter.keys()) {
          if (index[0] !== data.id) {
            this._pointPresenter.get(index).init(data);
            break;
          }
        }
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
    }
  }


  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }


    this._currentSortType = sortType;
    this._clearTrip();

    // /To do сортировка
    this._renderTrip();
  }

  _renderSort() {

    this._sortView = new SortView(this._currentSortType);
    this._sortView.setSortChangeHandler(this._handleSortChange);

    render(this._containerInner, this._sortView);
  }

  _renderContainerForDays() {
    render(this._container, this._dayListView);
  }

  _renderNoPoints() {
    render(this._containerInner, this._noPointView);
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(
        container,
        this._handleViewAction,
        this._handleModeChange
    );
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    const points = this._getPoints();
    const pointsLength = points.length;

    if (pointsLength === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderContainerForDays();

    let dayCounter = 1;
    let dayDate = null;
    let dayView = null;

    for (let point of points) {
      const pointDate = point.tripDates.start;
      const pointDay = pointDate.getDate();

      if (dayDate === pointDay) {
        this._renderPoint(dayView.getList(), point);
      } else {
        dayView = new DayView(pointDate, dayCounter);
        render(this._dayListView, dayView.getElement());
        this._renderPoint(dayView.getList(), point);
        dayCounter++;
        dayDate = pointDay;
      }
    }

  }

  _clearTrip(resetSortType = false) {

    this._pointPresenter
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
    remove(this._dayListView);
    remove(this._sortView);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}

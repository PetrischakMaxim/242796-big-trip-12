import {
  SortView,
  DayListView,
  DayView,
  MessageView
} from "../view/index.js";

import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import PointNewPresenter from "./point-new.js";

import {render, remove} from "../utils/dom-utils.js";
import {sortByPrice} from "../utils/utils.js";
import {sortByTime, sortByDate} from "../utils/date-utils.js";
import {filter} from "../utils/filter-utils.js";

import {
  SortType,
  UpdateType,
  UserAction,
  FilterType,
  Message
} from "../const.js";

export default class Trip {

  constructor(container, pointsModel, filterModel, api) {
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._pointPresenter = new Map();
    this._dayListView = new DayListView();
    this._isLoading = true;
    this._currentSortType = SortType.DEFAULT;

    this._actionViewHandler = this._actionViewHandler.bind(this);
    this._eventModelHandler = this._eventModelHandler.bind(this);

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._sortChangeHandler = this._sortChangeHandler.bind(this);

    this._messageNoPointsView = null;
    this._messageLoadingView = null;
    this._sortView = null;

    this._pointNewPresenter = new PointNewPresenter(this._dayListView, this._actionViewHandler);
  }

  init() {
    this._pointsModel.addObserver(this._eventModelHandler);
    this._filterModel.addObserver(this._eventModelHandler);
    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);

    this._pointsModel.removeObserver(this._eventModelHandler);
    this._filterModel.removeObserver(this._eventModelHandler);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const points = this._pointsModel.getPoints();
    const filterType = this._filterModel.getFilter();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.DEFAULT:
        return filteredPoints.sort(sortByDate);
    }

    return filteredPoints;
  }

  _modeChangeHandler() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _actionViewHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        for (let i of this._pointPresenter.keys()) {
          if (i === update.id) {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
            break;
          }
        }

        this._api.updatePoint(update)
        .then((response) => this._pointsModel.updatePoint(updateType, response))
        .catch(() => {
          for (let i of this._pointPresenter.keys()) {
            if (i === update.id) {
              this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
              break;
            }
          }
        });
        break;

      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
          this._pointNewPresenter.destroy();
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;

      case UserAction.DELETE_POINT:
        for (let i of this._pointPresenter.keys()) {
          if (i === update.id) {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
            break;
          }
        }
        this._api.deletePoint(update)
        .then(() => this._pointsModel.deletePoint(updateType, update))
        .catch(() => {
          for (let i of this._pointPresenter.keys()) {
            if (i === update.id) {
              this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
              break;
            }
          }
        });
        break;
    }
  }

  _eventModelHandler(updateType, data) {
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._messageLoadingView);
        this._renderTrip();
        break;
      case UpdateType.ERROR:
        remove(this._messageLoadingView);
        this._renderError();
        break;
    }
  }

  _sortChangeHandler(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    this._sortView = new SortView(this._currentSortType);
    this._sortView.setSortChangeHandler(this._sortChangeHandler);

    render(this._containerInner, this._sortView);
  }

  _renderContainerForDays() {
    render(this._container, this._dayListView);
  }

  _renderNoPoints() {
    this._messageNoPointsView = new MessageView(Message.NO_POINTS);
    render(this._container, this._messageNoPointsView);
  }

  _renderLoading() {
    this._messageLoadingView = new MessageView(Message.LOADING);
    render(this._container, this._messageLoadingView);
  }

  _renderError() {
    this._messagErrorView = new MessageView(Message.ERROR);
    render(this._container, this._messagErrorView);
  }

  _renderPoint(container, point) {

    const pointPresenter = new PointPresenter(
        container,
        this._actionViewHandler,
        this._modeChangeHandler
    );

    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
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

      const pointDate = point.start;
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
    remove(this._dayListView);
    remove(this._sortView);

    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._messageNoPointsView);
    remove(this._messageLoadingView);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

}

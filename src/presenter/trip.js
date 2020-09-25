import SortView from "../view/sort/sort.js";
import DayListView from "../view/day/day-list.js";
import DayView from "../view/day/day.js";
import NoPointView from "../view/point/no-point.js";
import LoadingView from "../view/loading/loading.js";
import PointPresenter from "./point.js";
import PointNewPresenter from "./point-new.js";
import {render, remove} from "../utils/dom-utils.js";
import {sortByPrice} from "../utils/utils.js";
import {sortByTime, sortByDate} from "../utils/date-utils.js";
import {filter} from "../utils/filter-utils.js";
import {SortType, UpdateType, UserAction, FilterType} from "../const.js";

export default class Trip {

  constructor(container, pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);

    this._dayListView = new DayListView();
    this._noPointView = new NoPointView();
    this._pointPresenter = new Map();
    this._sortView = null;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._loadingView = new LoadingView();
    this._api = api;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._dayListView, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderTrip();
  }

  destroy() {
    this._clearTrip(true);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
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

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update)
        .then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        });
        break;
      case UserAction.DELETE_POINT:
        this._api.deletePoint(update)
        .then(() => {
          this._pointsModel.deletePoint(updateType, update);
        });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingView);
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
    this._renderTrip();
  }

  _renderLoading() {
    render(this._container, this._loadingView);
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
    remove(this._noPointView);
    remove(this._loadingView);
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

  }
}

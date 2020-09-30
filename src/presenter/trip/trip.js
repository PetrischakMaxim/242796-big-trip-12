import SortView from '../../view/sort/sort.js';
import DaysView from '../../view/days/days.js';
import DayView from '../../view/day/day.js';
import PointsListView from '../../view/points-list/points-list.js';
import PointsItemView from '../../view/points-item/points-item.js';
import MessageView from '../../view/message/message.js';

import PointPresenter from '../point/point.js';
import PointNewPresenter from '../point-new/point-new.js';

import {
  formatDateISODdMmYyyyHhMm,
} from '../../utils/date-utils';

import {
  RenderPosition,
  render,
  remove,
  getElement,
} from '../../utils/dom-utils';

import {
  sortPointDurationDown,
  sortPointPriceDown,
} from '../../utils/sort-utils.js';

import {
  FilterType,
  PointMessage,
  SortType,
  UpdateType,
  UserAction,
  State,
} from '../../const';

import {filter} from '../../utils/filter-utils.js';

const {
  BEFORE_END,
} = RenderPosition;

const DEFAULT_SORT_TYPE = SortType.EVENT;

const reducePointByDay = (days, point) => {
  const dayDate = formatDateISODdMmYyyyHhMm(point.start)
      .toString()
      .split(`T`)[0];

  if (Array.isArray(days[dayDate])) {
    days[dayDate].push(point);
  } else {
    days[dayDate] = [point];
  }

  return days;
};

const groupPointsByDays = (points) => points
  .sort((pointA, pointB) => pointA.start - pointB.start)
  .reduce(reducePointByDay, {});


export default class Trip {
  constructor(tripContainer, tripModel, filterModel, api) {
    this._tripContainerElement = getElement(tripContainer);
    this._tripModel = tripModel;
    this._filterModel = filterModel;
    this._api = api;

    this._isLoading = true;
    this._currentSortType = DEFAULT_SORT_TYPE;
    this._pointPresenter = new Map();

    this._sortView = null;
    this._daysView = null;
    this._dayViews = [];
    this._pointMessageNoEventsView = null;
    this._pointMessageLoadingView = null;
    this._pointMessageErrorView = null;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
    this._pointChangeHandler = this._pointChangeHandler.bind(this);
    this._changeModeHandler = this._changeModeHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._tripContainerElement, this._viewActionHandler);
  }

  init() {
    this._tripModel.add(this._modelEventHandler);
    this._filterModel.add(this._modelEventHandler);


    this._render();
  }

  destroy() {
    this._clear({isResetSortType: true});

    this._tripModel.remove(this._modelEventHandler);
    this._filterModel.remove(this._modelEventHandler);
  }

  createPoint(callback) {
    this._currentSortType = SortType.EVENT;
    const destinations = this._tripModel.getDestinations();
    const offers = this._tripModel.getOffers();
    this._filterModel.set(UpdateType.MINOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(destinations, offers, callback);
  }

  _getPoints() {
    const points = this._tripModel.getPoints();
    const filterType = this._filterModel.get();
    const filteredPoints = filterType === FilterType.EVERYTHING
      ? points
      : filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortPointDurationDown);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPriceDown);
      default:
        return filteredPoints;
    }
  }

  _getDestinations() {
    return this._tripModel.getDestinations();
  }

  _getOffers() {
    return this._tripModel.getOffers();
  }

  _sortChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEvents();
    this._render();
  }

  _renderSort() {
    this._sortView = new SortView(this._currentSortType);
    render(this._tripContainerElement, this._sortView, BEFORE_END);
    this._sortView.setChangeHandler(this._sortChangeHandler);
  }

  _createPointsItem(point) {
    const destinations = this._getDestinations();
    const offers = this._getOffers();

    const pointsItemView = new PointsItemView();
    const pointPresenter = new PointPresenter(
        pointsItemView,
        this._pointChangeHandler,
        this._changeModeHandler,
        this._viewActionHandler
    );

    pointPresenter.init(point, destinations, offers);
    this._pointPresenter.set(point.id, pointPresenter);

    return pointsItemView;
  }

  _createEventDays(tripPoints) {
    const days = groupPointsByDays(tripPoints);

    return Object.entries(days)
    .map(([date, points], counter) => {
      return this._createEventDay(points, date, counter);
    });
  }

  _createEventDay(points, date, counter) {
    const dayCount = counter + 1;
    const tripPointsCount = this._getPoints().length;

    const dayView = new DayView({
      dayCount,
      isCountRender: tripPointsCount > 1 && points.length < tripPointsCount,
      date,
    });

    const pointsListView = new PointsListView();
    const pointsItemsViews = points.map((point) => this._createPointsItem(point));

    const fragment = document.createDocumentFragment();

    pointsItemsViews.forEach((pointsItem) => {
      fragment.appendChild(pointsItem.getElement());
    });

    render(
        pointsListView,
        fragment,
        BEFORE_END
    );

    render(dayView, pointsListView, BEFORE_END);

    return dayView;
  }

  _renderEvents(points) {
    this._renderSort();
    this._daysView = this._daysView || new DaysView();
    this._dayViews = this._currentSortType === SortType.EVENT
      ? this._createEventDays(points)
      : [this._createEventDay(points)];

    const fragment = document.createDocumentFragment();

    this._dayViews.forEach((dayView) => {
      fragment.appendChild(dayView.getElement());
    });

    render(
        this._daysView,
        fragment,
        BEFORE_END
    );

    render(this._tripContainerElement, this._daysView, BEFORE_END);
  }

  _renderNoEvents() {
    this._pointMessageNoEventsView = new MessageView(PointMessage.NO_EVENTS);
    render(this._tripContainerElement, this._pointMessageNoEventsView, BEFORE_END);
  }

  _renderLoading() {
    this._pointMessageLoadingView = new MessageView(PointMessage.LOADING);
    render(this._tripContainerElement, this._pointMessageLoadingView, BEFORE_END);
  }

  _renderError() {
    this._pointMessageErrorView = new MessageView(PointMessage.ERROR);
    render(this._tripContainerElement, this._pointMessageErrorView, BEFORE_END);
  }

  _render() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._tripModel.isEmpty()) {
      const points = this._getPoints();
      this._renderEvents(points);
      return;
    }

    if (this._daysView) {
      remove(this._daysView);
    }

    this._renderNoEvents();
  }

  _update({isResetSortType} = {isResetSortType: false}) {
    this._clear({isResetSortType});
    this._render();
  }

  _updatePoint(updatedPoint) {
    const destinations = this._getDestinations();
    const offers = this._getOffers();

    this._pointPresenter.get(updatedPoint.id).init(updatedPoint, destinations, offers);
  }

  _resetSortType() {
    this._currentSortType = DEFAULT_SORT_TYPE;
  }

  _clear({isResetSortType} = {isResetSortType: false}) {
    if (isResetSortType) {
      this._resetSortType();
    }

    this._pointNewPresenter.destroy();
    this._clearNoEvents();
    this._clearEvents();
  }

  _clearSort() {
    if (this._sortView !== null) {
      remove(this._sortView);
      this._sortView = null;
    }
  }

  _clearEvents() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    this._dayViews.forEach(remove);
    this._dayViews = [];
    this._clearSort();
  }

  _clearNoEvents() {
    if (this._pointMessageNoEventsView) {
      remove(this._pointMessageNoEventsView);
      this._pointMessageNoEventsView = null;
    }
  }

  _clearLoading() {
    if (this._pointMessageLoadingView !== null) {
      remove(this._pointMessageLoadingView);
      this._pointMessageLoadingView = null;
    }
  }

  _clearError() {
    if (this._pointMessageErrorView !== null) {
      remove(this._pointMessageErrorView);
      this._pointMessageErrorView = null;
    }
  }

  _pointChangeHandler(updatedPoint) {
    this._updatePoint(updatedPoint);
  }

  _changeModeHandler() {
    this._pointNewPresenter.destroy();


    this._pointPresenter
      .forEach((presenter) => presenter.resetView());
  }

  _viewActionHandler(
      actionType,
      updateType,
      update,
      successHandler = () => {},
      errorHandler = () => {}
  ) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(State.SAVING);
        this._api.updatePoint(update)
            .then((response) => {
              this._tripModel.updatePoint(updateType, response);
              successHandler();
            })
            .catch(() => {
              this._pointPresenter.get(update.id).setViewState(State.ABORTING);
              errorHandler();
            });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
            .then((response) => {
              this._tripModel.addPoint(updateType, response);
              this._pointNewPresenter.destroy();
              successHandler();
            })
            .catch(() => {
              this._pointNewPresenter.setAborting();
              errorHandler();
            });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(State.DELETING);
        this._api.deletePoint(update)
            .then(() => {
              this._tripModel.deletePoint(updateType, update);
              successHandler();
            })
            .catch(() => {
              this._pointPresenter.get(update.id).setViewState(State.ABORTING);
              errorHandler();
            });
        break;
    }
  }

  _modelEventHandler(updateType, pointData) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updatePoint(pointData);
        break;
      case UpdateType.MINOR:
        this._update();
        break;
      case UpdateType.MAJOR:
        this._update({isResetSortType: true});
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearLoading();
        this._render();
        break;
      case UpdateType.ERROR:
        this._clearLoading();
        this._renderError();
        break;
    }
  }
}

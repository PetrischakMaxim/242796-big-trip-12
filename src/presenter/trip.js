import SortView from "../view/sort/sort.js";
import DayListView from "../view/day/day-list.js";
import DayView from "../view/day/day.js";
import NoPointView from "../view/point/no-point.js";
import PointPresenter from "./point.js";

import {render, remove} from "../utils/dom-utils.js";
import {sortPrice, sortDate} from "../utils/utils.js";
import {SortType} from "../const.js";

export default class Trip {

  constructor(container, pointsModel) {
    this._pointsModel = pointsModel;
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);

    this._sortView = new SortView();
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
    this._pointsLength = this._getPoints().length;
    this._renderSort();
    this._renderTrip(true);
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

  _preparePoints() {
    return [...this._getPoints()].sort((point1, point2) => {
      if (point1.tripDates.start > point2.tripDates.start) {
        return 1;
      }
      if (point1.tripDates.start < point2.tripDates.start) {
        return -1;
      }
      return 0;
    });
  }

  _handleModeChange() {
    this._pointPresenter
      .forEach((presenter) => presenter.resetView());
  }


  // Удалить
  _handleStatusChange(updatedPoint) {
    for (let index of this._pointPresenter.keys()) {
      if (index[0] !== updatedPoint.id) {
        this._pointPresenter.get(index).init(updatedPoint);
        break;
      }
    }
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }


  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip();

    // /To do сортировка
    this._renderTrip(false);
  }

  _renderSort() {
    render(this._containerInner, this._sortView);
    this._sortView.setSortChangeHandler(this._handleSortChange);
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

  _renderTrip(isFirstRender) {

    if (this._pointsLength === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderContainerForDays();
    const points = (isFirstRender) ? this._preparePoints() : this._getPoints();
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

  _clearTrip() {
    this._pointPresenter
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
    remove(this._dayListView);
  }
}

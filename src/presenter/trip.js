import SortView from "../view/sort/sort.js";
import DayListView from "../view/day/day-list.js";
import DayView from "../view/day/day.js";
import PointsListView from "../view/point/points-list.js";
import NoPointView from "../view/point/no-point.js";
import PointPresenter from "./point.js";

import {render} from "../utils/dom-utils.js";
import {sortPrice, sortDate, updateItem} from "../utils/utils.js";
import {SortType} from "../const.js";

export default class Trip {

  constructor(container) {
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);
    this._daysCount = null;

    this._sortComponent = new SortView();
    this._dayListComponent = new DayListView();
    this._noPointComponent = new NoPointView();
    this._currentSortType = SortType.DEFAULT;
    this._pointPresenter = null;
    this._pointListInDay = null;

    this._handleStatusChange = this._handleStatusChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(points) {
    this._points = [...points];
    this._sourcePoints = [...points];
    this._pointsLength = this._points.length;
    this._pointPresenter = {};
    this._pointListInDay = [];

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleStatusChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._sourcePoints = updateItem(this._sourcePoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortDate);
        break;
      case SortType.PRICE:
        this._points.sort(sortPrice);
        break;
      default:
        this._points = [...this._sourcePoints];
    }

    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearTrip();

    this._preparePointsList(this._points)
      .forEach((points, i) => {
        points.forEach((event) => {
          this._renderPoint(this._pointListInDay[i], event);
        });
      });
  }

  _renderSort() {
    render(this._containerInner, this._sortComponent);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
  }

  _renderDaysContainer() {
    render(this._container, this._dayListComponent);
  }

  _renderNoPoints() {
    render(this._containerInner, this._noPointComponent);
  }

  _renderPoint(container, event) {
    const pointPresenter = new PointPresenter(
        container,
        this._handleStatusChange,
        this._handleModeChange
    );
    pointPresenter.init(event);
    this._pointPresenter[event.id] = pointPresenter;
  }

  _preparePointsList(points) {
    const pointsByDays = new Map();
    for (let event of points) {
      const date = event.tripDates.start.getDate();
      const day = pointsByDays.get(date);
      if (day) {
        day.push(event);
      } else {
        pointsByDays.set(date, Array.of(event));
      }
    }
    return [...pointsByDays.values()];
  }

  _renderPointsInDay(points, date, counter) {
    const dayInList = new DayView(date, counter + 1);
    const pointsList = new PointsListView().getElement();
    render(this._dayListComponent, dayInList);
    render(dayInList.getElement(), pointsList);
    this._daysCount = counter + 1;
    points.forEach((event) => this._renderPoint(pointsList, event));
    this._pointListInDay.push(pointsList);
  }

  _renderPoints(points) {
    this._preparePointsList(points)
    .forEach((eventPoints, counter) => {
      this._renderPointsInDay(eventPoints, eventPoints[0].tripDates.start, counter);
    });
  }

  _renderTrip() {
    if (this._points.every(() => this._pointsLength === 0)) {
      this._renderNoPoints();
      return;
    }
    this._renderPoints(this._points);
  }

  _renderBoard() {
    this._renderSort();
    this._renderDaysContainer();
    this._renderTrip();
  }

  _clearTrip() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }
}

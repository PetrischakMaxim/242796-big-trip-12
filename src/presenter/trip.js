import SortView from "../components/sort/sort.js";
import DayListView from "../components/day/day-list.js";
import DayView from "../components/day/day.js";
import PointsListView from "../components/point/points-list.js";
import NoPointView from "../components/point/no-point.js";
import RoutePresenter from "./route.js";

import {render, updateItem} from "../utils/dom-utils.js";
import {sortPrice, sortDate} from "../utils/utils.js";
import {SortType, POINT_COUNT} from "../const.js";

export default class Trip {

  constructor(container) {
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);
    this._tripCount = null;
    this._daysCount = null;

    this._sortComponent = new SortView();
    this._eventDaysContainer = new DayListView();
    this._emptyWaypointComponent = new NoPointView();
    this._currentSortType = SortType.DEFAULT;
    this._routePresenter = null;
    this._eventsListInDay = null;

    this._handleStatusChange = this._handleStatusChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(routes, count = POINT_COUNT) {
    this._routes = [...routes];
    this._sourceRoutes = [...routes];
    this._routesLength = this._routes.length;
    this._tripCount = count;
    this._routePresenter = {};
    this._eventsListInDay = [];

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._routePresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleStatusChange(updatedRoute) {
    this._routes = updateItem(this._routes, updatedRoute);
    this._sourceRoutes = updateItem(this._sourceRoutes, updatedRoute);
    this._routePresenter[updatedRoute.id].init(updatedRoute);
  }

  _sortTripEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._routes.sort(sortDate);
        break;
      case SortType.PRICE:
        this._routes.sort(sortPrice);
        break;
      default:
        this._routes = [...this._sourceRoutes];
    }

    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortTripEvents(sortType);
    this._clearTripList();

    this._prepareEventsList(this._routes)
      .forEach((events, i) => {
        events.forEach((event) => {
          this._renderEvent(this._eventsListInDay[i], event);
        });
      });
  }

  _renderSort() {
    render(this._containerInner, this._sortComponent);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
  }

  _renderDayListContainer() {
    render(this._container, this._eventDaysContainer);
  }

  _renderNoWaypoints() {
    render(this._containerInner, this._emptyWaypointComponent);
  }

  _renderEvent(container, event) {
    const routePresenter = new RoutePresenter(
        container,
        this._handleStatusChange,
        this._handleModeChange
    );
    routePresenter.init(event);
    this._routePresenter[event.id] = routePresenter;
  }

  _prepareEventsList(routes) {
    const eventsByDays = new Map();
    for (let event of routes) {
      const date = event.tripDates.start.getDate();
      const day = eventsByDays.get(date);
      if (day) {
        day.push(event);
      } else {
        eventsByDays.set(date, Array.of(event));
      }
    }
    return [...eventsByDays.values()];
  }

  _renderEventDay(events, date, counter) {
    const dayInList = new DayView(date, counter + 1);
    const eventsList = new PointsListView().getElement();
    render(this._eventDaysContainer, dayInList);
    render(dayInList.getElement(), eventsList);
    this._daysCount = counter + 1;
    events.forEach((event) => this._renderEvent(eventsList, event));
    this._eventsListInDay.push(eventsList);
  }

  _renderWaypoints(routes) {
    this._prepareEventsList(routes)
    .forEach((events, counter) => {
      this._renderEventDay(events, events[0].tripDates.start, counter);
    });
  }

  _renderTripList() {
    if (this._routes.every((route) =>
      !route.hasWaypoint ||
      this._routesLength === 0)) {
      this._renderNoWaypoints();
    } else {
      this._renderWaypoints(this._routes);
    }
  }

  _renderBoard() {
    this._renderSort();
    this._renderDayListContainer();
    this._renderTripList();
  }

  _clearTripList() {
    Object
      .values(this._routePresenter)
      .forEach((presenter) => presenter.destroy());
    this._routePresenter = {};
    this._tripCount = POINT_COUNT;
  }
}

import SortView from "../components/sort-form/sort-form.js";
import EventDayListView from "../components/event/event-day-list.js";
import EventDayView from "../components/event/event-day.js";
import NoWaypointView from "../components/event/no-event-waypoint.js";
import WaypointPresenter from "./waypoint.js";

import {render} from "../utils/dom-utils.js";
import {sortPrice, sortDate} from "../utils/utils.js";
import {SortType, TRIP_COUNT} from "../const.js";

export default class Trip {

  constructor(container) {
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);
    this._tripCount = null;
    this._daysCount = null;

    this._sortComponent = new SortView();
    this._dayListContainer = new EventDayListView();
    this._emptyWaypointComponent = new NoWaypointView();
    this._currentSortType = SortType.DEFAULT;
    this._waypointPresenter = null;

    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(routes, count = TRIP_COUNT) {
    this._routes = [...routes];
    this._sourceRoutes = [...routes];
    this._routesLength = this._routes.length;
    this._tripCount = count;
    this._waypointPresenter = {};

    this._renderTripBoard();
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
    // this._renderWaypoints(this._routes);
    this._renderEvents(this._routes);
  }

  _renderSort() {
    render(this._containerInner, this._sortComponent);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
  }

  _renderDayList() {
    render(this._container, this._dayListContainer);
  }

  _renderNoWaypoints() {
    render(this._containerInner, this._emptyWaypointComponent);
  }

  _renderEvent(container, event) {
    const waypointPresenter = new WaypointPresenter(container);
    waypointPresenter.init(event);
    this._waypointPresenter[event.id] = waypointPresenter;
  }

  _getCurrentTripList(dayList) {
    this._eventsInDayList = dayList.getElement().querySelectorAll(`.trip-events__list`);
    return this._eventsInDayList[this._eventsInDayList.length - 1];
  }

  _renderWaypoints(routes) {
    this._prepareEventsList(routes).forEach((events, counter) => {
      this._renderDays(events[0].tripDates.start, counter);
      // this._renderEvents(events);
    });
  }

  _renderEvents(events) {
    events.map((event) => {
      this._renderEvent(this._getCurrentTripList(this._dayListContainer), event);
    });
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

  _renderDays(date, counter) {
    render(this._dayListContainer, new EventDayView(date, counter + 1));
    this._daysCount = counter + 1;
  }

  _clearTripList() {
    Object
      .values(this._waypointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};
    this._tripCount = TRIP_COUNT;
  }

  _renderTrip() {
    if (this._routes.every((route) => !route.hasWaypoint || this._routesLength === 0)) {
      this._renderNoWaypoints();
    } else {
      this._renderWaypoints(this._routes);
    }
  }

  _renderTripBoard() {
    this._renderSort();
    this._renderDayList();
    this._renderTrip();
  }
}

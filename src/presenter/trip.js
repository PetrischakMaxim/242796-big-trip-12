import SortView from "../components/sort-form/sort-form.js";
import EventDayListView from "../components/event/event-day-list.js";
import EventDayView from "../components/event/event-day.js";
import EventItemView from "../components/event/event-item.js";
import EventFormView from "../components/event/event-form.js";
import NoWaypointView from "../components/event/no-event-waypoint.js";

import {render, replace} from "../utils/dom-utils.js";
import {sortPrice, sortDate} from "../utils/utils.js";
import {SortType} from "../const.js";

export default class Trip {

  constructor(container) {
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);

    this._sortComponent = new SortView();
    this._dayListContainer = new EventDayListView();
    this._emptyWaypointComponent = new NoWaypointView();
    this._currentSortType = SortType.DEFAULT;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(routes, count) {
    this._routes = [...routes];
    this._sourceRoutes = [...routes];
    this._routesLength = this._routes.length;
    this._tripCount = count;

    this._renderTripBoard();
  }

  _sortTasks(sortType) {
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

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortTasks(sortType);
    this._clearTripList();
    this._renderWaypoints();
  }

  _renderSort() {
    render(this._containerInner, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderDayList() {
    render(this._container, this._dayListContainer);
  }

  _renderNoWaypoints() {
    render(this._containerInner, this._emptyWaypointComponent);
  }

  _renderEvent(routeListElement, route) {
    const eventComponent = new EventItemView(route);
    const eventFormComponent = new EventFormView(route);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replace(eventComponent, eventFormComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setClickHandler(() => {
      replace(eventFormComponent, eventComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventFormComponent.setFormSubmitHandler(() => {
      replace(eventComponent, eventFormComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(routeListElement, eventComponent);
  }

  _getTripDayList(dayList) {
    const tripEventList = dayList.getElement().querySelectorAll(`.trip-events__list`);
    return tripEventList[tripEventList.length - 1];
  }

  _renderWaypoints() {
    this._renderDayList();
    let routeIndex = 0;
    const {start: startDate} = this._routes[0].tripDates;
    let currentDay = startDate.getDate();
    const lastDay = this._routes[this._routesLength - 1].tripDates.start.getDate();
    let currentDate = startDate;
    const days = lastDay - currentDay + 1;

    Array(days).fill().forEach((_, tripDay) => {
      render(this._dayListContainer, new EventDayView(currentDate, tripDay + 1));
      const tripEventList = this._getTripDayList(this._dayListContainer);
      for (let i = routeIndex; i < this._tripCount; i++) {
        const {start} = this._routes[i].tripDates;
        if (start.getDate() === currentDay) {
          this._renderEvent(tripEventList, this._routes[i]);
        } else {
          currentDay = start.getDate();
          currentDate = start;
          routeIndex = i;
          break;
        }
      }
    });
  }

  _clearTripList() {
    this._dayListContainer.getElement().innerHTML = ``;
    this._renderedTaskCount = this._tripCount;
  }

  _renderTrip() {
    if (this._routes.every((route) => !route.hasWaypoint || this._routesLength === 0)) {
      this._renderNoWaypoints();
    } else {
      this._renderWaypoints();
    }
  }

  _renderTripBoard() {
    this._renderSort();
    this._renderTrip();
  }
}

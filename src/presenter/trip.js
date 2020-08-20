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

    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(routes, count) {
    this._routes = [...routes];
    this._sourceRoutes = [...routes];
    this._routesLength = this._routes.length;
    this._tripCount = count;

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
    this._routes.forEach((route)=> {
      this._renderEvent(this._eventsInDayList[0], route);
    });

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
    this._eventsInDayList = dayList.getElement().querySelectorAll(`.trip-events__list`);
    return this._eventsInDayList[this._eventsInDayList.length - 1];
  }

  _renderWaypoints(routes) {
    this._renderDayList();
    let routeIndex = 0;
    const {start: startDate} = routes[0].tripDates;
    let currentDay = startDate.getDate();
    const lastDay = routes[this._routesLength - 1].tripDates.start.getDate();
    let currentDate = startDate;
    const days = lastDay - currentDay + 1;

    Array(days).fill().forEach((_, tripDay) => {
      this._renderDays(currentDate, tripDay);
      for (let i = routeIndex; i < this._tripCount; i++) {
        const {start} = this._routes[i].tripDates;
        if (start.getDate() === currentDay) {
          this._renderEvent(this._getTripDayList(this._dayListContainer), this._routes[i]);
        } else {
          currentDay = start.getDate();
          currentDate = start;
          routeIndex = i;
          break;
        }
      }
    });
  }

  _renderDays(date, counter) {
    render(this._dayListContainer, new EventDayView(date, counter + 1));
  }

  _clearTripList() {
    this._eventsInDayList.forEach((elem) =>{
      elem.innerHTML = ``;
    });
    this._renderedTripCount = this._tripCount;
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
    this._renderTrip();
  }
}

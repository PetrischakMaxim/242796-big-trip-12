import SortView from "../components/sort-form/sort-form.js";
import EventDayListView from "../components/event/event-day-list.js";
import EventDayView from "../components/event/event-day.js";
import EventItemView from "../components/event/event-item.js";
import EventFormView from "../components/event/event-form.js";
import NoWaypointView from "../components/event/no-event-waypoint.js";

import {render, replace} from "../utils/dom-utils.js";

export default class Trip {
  constructor(container) {
    this._container = container;
    this._containerInner = this._container.querySelector(`.trip-events`);

    this._sortComponent = new SortView();
    this._dayListComponent = new EventDayListView();
    this._eventDayComponent = new EventDayView();
    this._noWaypointComponent = new NoWaypointView();
    this._tripEventList = null;
  }

  init(routes, count) {
    this._routes = [...routes];
    this._routesLength = this._routes.length;
    this._tripCount = count;

    this._renderSort();
    this._renderDayList();
    this._renderTrip();
  }

  _renderSort() {
    render(this._containerInner, this._sortComponent);
  }

  _renderDayList() {
    render(this._container, this._dayListComponent);
  }

  _renderNoWaypoints() {
    render(this._containerInner, this._noWaypointComponent);
  }

  _renderEvent(eventListElement, route) {
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

    render(eventListElement, eventComponent);
  }

  _getTripDayList(dayList) {
    const tripEventList = dayList.getElement().querySelectorAll(`.trip-events__list`);
    return tripEventList[tripEventList.length - 1];
  }

  _renderWaypoints() {
    let dayCounter = 1;
    let routeIndex = 0;
    const {start: startDate} = this._routes[0].tripDates;
    let currentDay = startDate.getDate();
    const lastDay = this._routes[this._routesLength - 1].tripDates.start.getDate();
    let currentDate = startDate;

    for (let day = currentDay; day <= lastDay; day++) {

      render(this._dayListComponent, new EventDayView(currentDate, dayCounter));

      this._tripEventList = this._getTripDayList(this._dayListComponent);

      for (let i = routeIndex; i < this._tripCount; i++) {
        const {start} = this._routes[i].tripDates;
        if (start.getDate() === currentDay) {
          this._renderEvent(this._tripEventList, this._routes[i]);
        } else {
          currentDay = start.getDate();
          currentDate = start;
          dayCounter++;
          routeIndex = i;
          break;
        }
      }
    }
  }

  _renderTrip() {
    if (this._routes.every((route) => !route.hasWaypoint || this._routesLength === 0)) {
      this._renderNoWaypoints();
    } else {
      this._renderWaypoints();
    }
  }
}

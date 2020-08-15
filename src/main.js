import TripInfoView from "./components/info/trip-info.js";
import FilterView from "./components/menu-controls/filter-form.js";
import TabsView from "./components/menu-controls/tabs.js";
import SortView from "./components/sort-form/sort-form.js";
import EventFormView from "./components/event/event-form.js";
import EventDayListView from "./components/event/event-day-list.js";
import EventDayView from "./components/event/event-day.js";
import EventItemView from "./components/event/event-item.js";
import NoWaypointView from "./components/event/no-event-waypoint.js";

import {generateRoute} from "./mock/route.js";
import {render, RenderPosition} from "./utils/dom-utils.js";

const TASK_COUNT = 8;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);
const controlsWrapper = tripMainInfoElement.querySelector(`.trip-controls`);

render(tripMainInfoElement, new TripInfoView(routes).getElement(), RenderPosition.AFTERBEGIN);
render(controlsWrapper, new TabsView().getElement(), RenderPosition.AFTERBEGIN);
render(controlsWrapper, new FilterView().getElement());

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);

const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);
render(tripEventsElement, new SortView().getElement());

const dayListComponent = new EventDayListView();
render(pageMainContainer, dayListComponent.getElement());

const renderEvent = (eventListElement, route) => {
  const eventComponent = new EventItemView(route);
  const eventFormComponent = new EventFormView(route);

  const replaceEventItemState = (newElement, oldElement) => {
    eventListElement.replaceChild(newElement.getElement(), oldElement.getElement());
  };
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEventItemState(eventComponent, eventFormComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventComponentBtn = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  eventComponentBtn.addEventListener(`click`, () => {
    replaceEventItemState(eventFormComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const formComponent = eventFormComponent.getElement().querySelector(`.event`);
  formComponent.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEventItemState(eventComponent, eventFormComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement());
};

let dayCounter = 1;
let routeIndex = 0;
const {start: startDate} = routes[0].tripDates;
let currentDay = startDate.getDate();
const lastDay = routes[routes.length - 1].tripDates.start.getDate();
let currentDate = startDate;

for (let day = currentDay; day <= lastDay; day++) {

  render(dayListComponent.getElement(), new EventDayView(currentDate, dayCounter).getElement());
  const tripEventList = dayListComponent.getElement().querySelectorAll(`.trip-events__list`);
  const tripEventListElement = tripEventList[tripEventList.length - 1];

  if (routes.every((route) => !route.hasWaypoint)) {
    render(tripEventsElement, new NoWaypointView().getElement());
  } else {
    for (let i = routeIndex; i < TASK_COUNT; i++) {
      const {start} = routes[i].tripDates;
      if (start.getDate() === currentDay) {
        renderEvent(tripEventListElement, routes[i]);
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



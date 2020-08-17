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
import {render, replace, RenderPosition} from "./utils/dom-utils.js";

const TASK_COUNT = 8;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);
const controlsWrapper = tripMainInfoElement.querySelector(`.trip-controls`);

render(tripMainInfoElement, new TripInfoView(routes), RenderPosition.AFTERBEGIN);
render(controlsWrapper, new TabsView(), RenderPosition.AFTERBEGIN);
render(controlsWrapper, new FilterView());

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);

const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);
render(tripEventsElement, new SortView());

const dayListComponent = new EventDayListView();
render(pageMainContainer, dayListComponent);

const renderEvent = (eventListElement, route) => {
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
};
if (routes.every((route) => !route.hasWaypoint || routes.length === 0)) {
  render(tripEventsElement, new NoWaypointView());
} else {
  let dayCounter = 1;
  let routeIndex = 0;
  const {start: startDate} = routes[0].tripDates;
  let currentDay = startDate.getDate();
  const lastDay = routes[routes.length - 1].tripDates.start.getDate();
  let currentDate = startDate;

  for (let day = currentDay; day <= lastDay; day++) {

    render(dayListComponent, new EventDayView(currentDate, dayCounter));
    const tripEventList = dayListComponent.getElement().querySelectorAll(`.trip-events__list`);
    const tripEventListElement = tripEventList[tripEventList.length - 1];

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



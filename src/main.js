
import TripInfoView from "./components/info/trip-info.js";
import FilterFormView from "./components/menu-controls/filter-form.js";
import TabsView from "./components/menu-controls/tabs.js";
import SortFormView from "./components/sort-form/sort-form.js";
import EventFormView from "./components/event/event-form.js";
import EventDayListView from "./components/event/event-day-list.js";
import EventDayView from "./components/event/event-day.js";
import EventItemView from "./components/event/event-item.js";

import {generateRoute} from "./mock/route.js";
import {renderElement, RenderPosition} from "./utils.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;
const TASK_COUNT = 20;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);
const tripEventFormRoute = routes[0];

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);
const controlsWrapper = tripMainInfoElement.querySelector(`.trip-controls`);

renderElement(tripMainInfoElement, new TripInfoView(routes).getElement(), AFTERBEGIN);
renderElement(controlsWrapper, new TabsView().getElement(), AFTERBEGIN);
renderElement(controlsWrapper, new FilterFormView().getElement(), BEFOREEND);

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);
const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);

renderElement(tripEventsElement, new SortFormView().getElement(), BEFOREEND);
renderElement(tripEventsElement, new EventFormView(tripEventFormRoute).getElement(), BEFOREEND);
const dayListComponent = new EventDayListView();
renderElement(pageMainContainer, dayListComponent.getElement(), BEFOREEND);

let dayCounter = 1;
let index = 1;
const {start: startDate} = routes[1].tripDates;
let currentDay = startDate.getDate();
const lastDay = routes[routes.length - 1].tripDates.start.getDate();
let currentDate = startDate;


for (let day = currentDay; day <= lastDay; day++) {

  renderElement(dayListComponent.getElement(), new EventDayView(currentDate, dayCounter).getElement(), BEFOREEND);
  const tripEventList = dayListComponent.getElement().querySelectorAll(`.trip-events__list`);
  const tripEventListElement = tripEventList[tripEventList.length - 1];

  for (let i = index; i < TASK_COUNT; i++) {
    const {start} = routes[i].tripDates;
    if (start.getDate() === currentDay) {
      renderElement(tripEventListElement, new EventItemView(routes[i]).getElement(), BEFOREEND);
    } else {
      currentDay = start.getDate();
      currentDate = start;
      dayCounter++;
      index = i;
      break;
    }
  }
}



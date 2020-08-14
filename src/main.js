
import {
  createEventDayList,
  createEventDay,
  createEventForm,
  createEventItem,
  createTripFilter,
  createTripInfo,
  createTripSortForm
} from "./components/index.js";

import PageMenuView from "./components/menu/menu.js";

import {generateRoute} from "./mock/route.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;
const TASK_COUNT = 20;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);
const tripEventFormRoute = routes[0];

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);

renderTemplate(tripMainInfoElement, createTripInfo(routes), AFTERBEGIN);

const tripControlsElement = tripMainInfoElement.querySelector(`.trip-controls`);

renderElement(tripControlsElement, new PageMenuView().getElement(), AFTERBEGIN);
renderTemplate(tripControlsElement, createTripFilter(), BEFOREEND);

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);
const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);

renderTemplate(tripEventsElement, createTripSortForm(), BEFOREEND);
renderTemplate(tripEventsElement, createEventForm(tripEventFormRoute), BEFOREEND);
renderTemplate(pageMainContainer, createEventDayList(), BEFOREEND);

const tripDayListElement = pageMainContainer.querySelector(`.trip-days`);
let dayCounter = 1;
let index = 1;
const {start: startDate} = routes[1].tripDates;
let currentDay = startDate.getDate();
const lastDay = routes[routes.length - 1].tripDates.start.getDate();
let currentDate = startDate;

for (let day = currentDay; day <= lastDay; day++) {

  renderTemplate(tripDayListElement, createEventDay(currentDate, dayCounter), BEFOREEND);
  const tripEventList = tripDayListElement.querySelectorAll(`.trip-events__list`);
  const tripEventListElement = tripEventList[tripEventList.length - 1];

  for (let i = index; i < TASK_COUNT; i++) {
    const {start} = routes[i].tripDates;
    if (start.getDate() === currentDay) {
      renderTemplate(tripEventListElement, createEventItem(routes[i]), BEFOREEND);
    } else {
      currentDay = start.getDate();
      currentDate = start;
      dayCounter++;
      index = i;
      break;
    }
  }

}



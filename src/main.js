
import {
  createEventDayList,
  createEventDay,
  createEventForm,
  createEventItem,
  createTripFilter,
  createTripInfo,
  createTripMenu,
  createTripSortForm
} from "./components/index.js";

import {generateRoute} from "./mock/route.js";


const TASK_COUNT = 20;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);
const tripEventFormRoute = routes[0];

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);

renderTemplate(tripMainInfoElement, createTripInfo(routes), `afterbegin`);

const tripControlsElement = tripMainInfoElement.querySelector(`.trip-controls`);

renderTemplate(tripControlsElement, createTripMenu(), `afterbegin`);
renderTemplate(tripControlsElement, createTripFilter(), `beforeend`);

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);
const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);

renderTemplate(tripEventsElement, createTripSortForm(), `beforeend`);
renderTemplate(tripEventsElement, createEventForm(tripEventFormRoute), `beforeend`);
renderTemplate(pageMainContainer, createEventDayList(), `beforeend`);

const tripDayListElement = pageMainContainer.querySelector(`.trip-days`);
let dayCounter = 1;
let index = 1;
const {start: startDate} = routes[1].tripDates;
let currentDay = startDate.getDate();
const lastDay = routes[routes.length - 1].tripDates.start.getDate();
let currentDate = startDate;

for (let day = currentDay; day <= lastDay; day++) {

  renderTemplate(tripDayListElement, createEventDay(currentDate, dayCounter), `beforeend`);
  const tripEventList = tripDayListElement.querySelectorAll(`.trip-events__list`);
  const tripEventListElement = tripEventList[tripEventList.length - 1];

  for (let i = index; i < TASK_COUNT; i++) {
    const {start} = routes[i].tripDates;
    if (start.getDate() === currentDay) {
      renderTemplate(tripEventListElement, createEventItem(routes[i]), `beforeend`);
    } else {
      currentDay = start.getDate();
      currentDate = start;
      dayCounter++;
      index = i;
      break;
    }
  }

}



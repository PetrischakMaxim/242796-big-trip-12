
import {
  createEventDayList,
  createEventDay,
  createEventForm,
  createEventItem,
  createTripInfo,
} from "./components/index.js";

import FilterFormView from "./components/menu-controls/filter-form.js";
import TabsView from "./components/menu-controls/tabs.js";
import SortFormView from "./components/sort-form/sort-form.js";

import {generateRoute} from "./mock/route.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;
const TASK_COUNT = 20;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);
const tripEventFormRoute = routes[0];

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);
const controlsWrapper = tripMainInfoElement.querySelector(`.trip-controls`);

renderElement(controlsWrapper, new TabsView().getElement(), AFTERBEGIN);
renderElement(controlsWrapper, new FilterFormView().getElement(), BEFOREEND);


renderTemplate(tripMainInfoElement, createTripInfo(routes), AFTERBEGIN);

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);
const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);

renderElement(tripEventsElement, new SortFormView().getElement(), BEFOREEND);
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



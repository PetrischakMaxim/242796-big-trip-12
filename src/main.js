import {createTripInfo} from "./view/trip-info";
import {createTripMenu} from "./view/trip-menu";
import {createTripFilter} from "./view/trip-filter";
import {createTripSortForm} from "./view/sort-form";
import {createTripEventForm} from "./view/event-form";
import {createTripDayList} from "./view/trip-day-list";
import {createTripDay} from "./view/trip-day";
import {createEventList} from "./view/event-list";
import {createEventItem} from "./view/event-item";
import {generateRoute} from "./mock/route.js";

const TASK_COUNT = 20;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);
const tripEventFormRoute = routes[0];

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);

renderTemplate(tripMainInfoElement, createTripInfo(), `afterbegin`);

const tripControlsElement = tripMainInfoElement.querySelector(`.trip-controls`);

renderTemplate(tripControlsElement, createTripMenu(), `afterbegin`);
renderTemplate(tripControlsElement, createTripFilter(), `beforeend`);

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);
const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);

renderTemplate(tripEventsElement, createTripSortForm(), `beforeend`);
renderTemplate(tripEventsElement, createTripEventForm(tripEventFormRoute), `beforeend`);
renderTemplate(pageMainContainer, createTripDayList(), `beforeend`);

const tripDayListElement = pageMainContainer.querySelector(`.trip-days`);

renderTemplate(tripDayListElement, createTripDay(), `beforeend`);

const tripDayItemElement = tripDayListElement.querySelector(`.trip-days__item`);

renderTemplate(tripDayItemElement, createEventList(), `beforeend`);

const tripEventList = tripDayItemElement.querySelector(`.trip-events__list`);

for (let i = 1; i < TASK_COUNT; i++) {
  renderTemplate(tripEventList, createEventItem(routes[i]), `beforeend`);
}


import TripInfoView from "./components/info/trip-info.js";
import FilterFormView from "./components/menu-controls/filter-form.js";
import TabsView from "./components/menu-controls/tabs.js";
import SortFormView from "./components/sort-form/sort-form.js";
import EventFormView from "./components/event/event-form.js";
import EventDayListView from "./components/event/event-day-list.js";
import EventDayView from "./components/event/event-day.js";
import EventItemView from "./components/event/event-item.js";

import {generateRoute} from "./mock/route.js";
import {render, RenderPosition} from "./utils.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;
const TASK_COUNT = 8;
const routes = new Array(TASK_COUNT).fill().map(generateRoute);

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMainInfoElement = pageHeaderElement.querySelector(`.trip-main`);
const controlsWrapper = tripMainInfoElement.querySelector(`.trip-controls`);

render(tripMainInfoElement, new TripInfoView(routes).getElement(), AFTERBEGIN);
render(controlsWrapper, new TabsView().getElement(), AFTERBEGIN);
render(controlsWrapper, new FilterFormView().getElement(), BEFOREEND);

const pageMainElement = document.querySelector(`.page-main`);
const pageMainContainer = pageMainElement.querySelector(
    `.page-body__container`
);

const tripEventsElement = pageMainContainer.querySelector(`.trip-events`);
render(tripEventsElement, new SortFormView().getElement(), BEFOREEND);

const renderEvent = (eventListElement, route) => {
  const eventComponent = new EventItemView(route);
  const eventFormComponent = new EventFormView(route);

  const replaceEventItemState = (newElement, oldElement) => {
    eventListElement.replaceChild(newElement.getElement(), oldElement.getElement());
  };

  const eventComponentBtn = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  eventComponentBtn.addEventListener(`click`, () => {
    replaceEventItemState(eventFormComponent, eventComponent);
  });

  const formComponentBtn = eventFormComponent.getElement().querySelector(`.event__reset-btn`);
  formComponentBtn.addEventListener(`click`, () => {
    replaceEventItemState(eventComponent, eventFormComponent);
  });

  render(eventListElement, eventComponent.getElement(), BEFOREEND);
};


const dayListComponent = new EventDayListView();
render(pageMainContainer, dayListComponent.getElement(), BEFOREEND);

let dayCounter = 1;
let routeIndex = 0;
const {start: startDate} = routes[0].tripDates;
let currentDay = startDate.getDate();
const lastDay = routes[routes.length - 1].tripDates.start.getDate();
let currentDate = startDate;


for (let day = currentDay; day <= lastDay; day++) {

  render(dayListComponent.getElement(), new EventDayView(currentDate, dayCounter).getElement(), BEFOREEND);
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



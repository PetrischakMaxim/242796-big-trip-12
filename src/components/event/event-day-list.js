import AbstractView from "../abstract.js";

const createEventDayListTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class EventDayList extends AbstractView {

  getTemplate() {
    return createEventDayListTemplate();
  }

}

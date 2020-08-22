import AbstractView from "../abstract.js";

const createEventListTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class EventsDayList extends AbstractView {

  getTemplate() {
    return createEventListTemplate();
  }

}

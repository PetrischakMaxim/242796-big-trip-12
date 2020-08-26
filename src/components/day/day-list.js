import AbstractView from "../abstract.js";

export default class DayList extends AbstractView {

  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }

}

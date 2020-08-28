import AbstractView from "../abstract/abstract.js";

export default class NoPoint extends AbstractView {

  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }

}

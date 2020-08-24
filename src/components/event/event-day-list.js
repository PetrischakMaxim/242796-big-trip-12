import AbstractView from "../abstract.js";

const createEventDaysContainer = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripContainer extends AbstractView {

  getTemplate() {
    return createEventDaysContainer();
  }

}

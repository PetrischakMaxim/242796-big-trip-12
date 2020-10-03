import AbstractView from '../abstract/abstract.js';

export default class Days extends AbstractView {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}

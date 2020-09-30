import AbstractView from '../abstract/abstract.js';

export default class PointsItem extends AbstractView {

  getTemplate() {
    return `<li class="trip-events__item"></li>`;
  }
}

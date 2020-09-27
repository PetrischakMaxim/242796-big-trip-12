import AbstractView from "../abstract/abstract.js";

const createInfoTemplate = (title, time, cost) => (
  `<section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${(title) ? title : ``}
        </h1>
        <p class="trip-info__dates">
          ${(time) ? time : ``}
        </p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;
        <span class="trip-info__cost-value">
          ${(cost) ? cost : 0}
        </span>
      </p>
  </section>`
);

export default class Info extends AbstractView {
  constructor(title, time, cost) {
    super();
    this._title = title;
    this._time = time;
    this._cost = cost;
  }

  getTemplate() {
    return createInfoTemplate(this._title, this._time, this._cost);
  }
}

import AbstractView from "../abstract/abstract.js";

export default class Info extends AbstractView {

  constructor(title, time, cost) {
    super();
    this._title = title;
    this._time = time;
    this._cost = cost;
  }

  getTemplate() {
    return (
      `<section class="trip-main__trip-info trip-info">
          <div class="trip-info__main">
            <h1 class="trip-info__title">
              ${(this._title) ? this._title : ``}
            </h1>
            <p class="trip-info__dates">
              ${(this._time) ? this._time : ``}
            </p>
          </div>
          <p class="trip-info__cost">
            Total: &euro;&nbsp;
            <span class="trip-info__cost-value">
              ${(this._cost) ? this._cost : 0}
            </span>
          </p>
      </section>`
    );
  }
}

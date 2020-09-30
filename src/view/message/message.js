import AbstractView from '../abstract/abstract.js';


export default class Message extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return (`
    <p class="trip-events__msg">
      ${this._message}
    </p>`
    );
  }
}

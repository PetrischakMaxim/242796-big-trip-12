import AbstractView from '../abstract/abstract.js';

export default class Message extends AbstractView {

  constructor(note) {
    super();
    this._note = note;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${this._note}</p>`;
  }
}

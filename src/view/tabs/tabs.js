import AbstractView from '../abstract/abstract.js';
import {TabItem} from '../../const.js';

const TABS = Object.values(TabItem);
const ACTIVE_TAB_CLASS = `trip-tabs__btn--active`;

export default class Tabs extends AbstractView {

  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
    this._click = null;
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        ${TABS.map((tab) => (
        `<a class="trip-tabs__btn ${tab === TabItem.TABLE ? ACTIVE_TAB_CLASS : ``}"
          href="#" data-tab="${tab}" >
          ${tab}
        </a>`
      )).join(``)}
      </nav>`
    );
  }

  setClickHandler(callback) {
    this._click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    const prevActiveTabElement = this.getElement().querySelector(`.${ACTIVE_TAB_CLASS}`);
    const prevActiveTab = prevActiveTabElement.dataset.tab;
    prevActiveTabElement.classList.remove(ACTIVE_TAB_CLASS);

    evt.target.classList.add(ACTIVE_TAB_CLASS);
    const activeTab = evt.target.dataset.tab;

    if (activeTab !== prevActiveTab) {
      this._click(activeTab);
    }
  }
}

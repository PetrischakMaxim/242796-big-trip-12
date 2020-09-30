import AbstractView from '../abstract/abstract.js';
import {TabItem} from '../../const.js';

const TABS = Object.values(TabItem);
const ACTIVE_TAB_CLASS = `trip-tabs__btn--active`;

export default class Tabs extends AbstractView {
  constructor() {
    super();
    this._tabsClickHandler = this._tabsClickHandler.bind(this);
  }

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        ${TABS.map((tab) => (
        `<a class="trip-tabs__btn ${tab === TabItem.TABLE ? ACTIVE_TAB_CLASS : ``}"
              href="#"
              data-tab="${tab}"
            >
              ${tab}
            </a>`
      )).join(``)}
      </nav>`
    );
  }

  setClickHandler(callback) {
    this._tabsClick = callback;
    this.getElement().addEventListener(`click`, this._tabsClickHandler);
  }

  _tabsClickHandler(evt) {
    evt.preventDefault();
    const prevActiveTabElement = this.getElement().querySelector(`.${ACTIVE_TAB_CLASS}`);
    const prevActiveTab = prevActiveTabElement.dataset.tab;
    prevActiveTabElement.classList.remove(ACTIVE_TAB_CLASS);

    evt.target.classList.add(ACTIVE_TAB_CLASS);
    const activeTab = evt.target.dataset.tab;

    if (activeTab !== prevActiveTab) {
      this._tabsClick(activeTab);
    }
  }
}

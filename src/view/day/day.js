import AbstractView from '../abstract/abstract.js';

const convertToTitle = (value) => {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.toLocaleString(`en-us`, {month: `short`});

  return `${month} ${day}`;
};

const getDayInfoTemplate = ({dayCount, date}) => {
  return (
    `<div class="day__info">
      <span class="day__counter">${dayCount}</span>
      <time class="day__date" datetime=${date}>
        ${convertToTitle(date)}
      </time>
    </div>`
  );
};


export default class Day extends AbstractView {
  constructor(dayData) {
    super();
    this._dayData = dayData;
  }

  getTemplate() {
    return (
      `<li class="trip-days__item  day">
        ${this._dayData.isCountRender ? getDayInfoTemplate(this._dayData) : `<div class="day__info"></div>`}
      </li>`
    );
  }
}

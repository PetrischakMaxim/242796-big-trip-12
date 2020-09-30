import AbstractView from '../abstract/abstract.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {capitalizeString, convertDurationValue} from '../../utils/utils.js';
import {TRANSFERS, pointTypeToEmoji, PointGroupType} from '../../const.js';

const CHAR_TYPE = `horizontalBar`;
const COUNT = 1;

const HeightGap = {
  MONEY: 6,
  TRANSPORT: 4,
  TIME: 6,
};

const Bar = {
  HEIGHT: 70,
  THICKNESS: 50,
  MIN_LENGTH: 50,
  BACKGROUND: `#ffffff`,
  HOVER_BACKGROUND: `#ffffff`,
  ANCHOR: `start`,
};

const Tick = {
  COLOR: `#000000`,
  PADDING: 5,
  FONT_SIZE: 18,
};

const Title = {
  FONT_COLOR: `#000000`,
  FONT_SIZE: 15,
  POSITION: `left`,
};

const Label = {
  FONT_COLOR: `#000000`,
  PADDING: 5,
  FONT_SIZE: 10,
  ANCHOR: `end`,
  ALIGN: `start`,
};

const moneyChartConfig = {
  key: `price`,
  datalabelsFormater: (val) => `€ ${val}`,
  title: `MONEY`,
};

const transportChartConfig = {
  key: `count`,
  datalabelsFormater: (val) => `${val}x`,
  title: `TRANSPORT`,
};

const timeSpentChartConfig = {
  key: `duration`,
  datalabelsFormater: (val) => `${convertDurationValue(val)}`,
  title: `TIME SPENT`,
};

const convertToData = (points) => {
  const chartData = {};
  points.forEach((point) => {
    if (!chartData[point.type]) {
      chartData[point.type] = {
        label: pointTypeToEmoji[point.type],
        price: point.price,
        duration: point.duration,
        count: COUNT,
        groupType: TRANSFERS.includes(capitalizeString(point.type))
          ? PointGroupType.TRANSFER
          : PointGroupType.ACTVITY,
      };
    } else {
      chartData[point.type].price += point.price;
      chartData[point.type].duration += point.duration;
      chartData[point.type].count++;
    }
  });

  return chartData;
};

const renderChart = (chartCtx, chartData, chartConfig) => {
  const labels = [];
  const data = [];

  const {
    key,
    datalabelsFormater,
    title,
  } = chartConfig;

  chartData.forEach((item) => {
    labels.push(item.label);
    data.push(item[key]);
  });

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: CHAR_TYPE,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: Bar.BACKGROUND,
        hoverBackgroundColor: Bar.HOVER_BACKGROUND,
        anchor: Bar.ANCHOR,
        barThickness: Bar.THICKNESS,
        minBarLength: Bar.MIN_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: Label.FONT_SIZE,
          },
          color: Label.FONT_COLOR,
          padding: Label.PADDING,
          anchor: Label.ANCHOR,
          align: Label.ALIGN,
          formatter: datalabelsFormater,
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: Title.FONT_COLOR,
        fontSize: Title.FONT_SIZE,
        position: Title.POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Tick.FONT_COLOR,
            padding: Tick.PADDING,
            fontSize: Tick.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">
        Trip statistics
      </h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900">
        </canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900">
        </canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900">
        </canvas>
      </div>
    </section>`
  );
};

export default class Stats extends AbstractView {

  constructor(points) {
    super();
    this._data = convertToData(points);

    this._setChart();
  }


  getTemplate() {
    return createStatisticsTemplate();
  }

  _getMoneyChartData() {
    return Object.values(this._data).sort((itemA, itemB) => itemB.price - itemA.price);
  }

  _getTransportChartData() {
    return Object.values(this._data).
      filter((item) => item.groupType === PointGroupType.TRANSFER)
      .sort((itemA, itemB) => itemB.count - itemA.count);
  }

  _getTimeSpentChartData() {
    return Object.values(this._data).sort((itemA, itemB) => itemB.duration - itemA.duration);
  }

  _setChart() {

    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    moneyCtx.height = Bar.HEIGHT * HeightGap.MONEY;
    transportCtx.height = Bar.HEIGHT * HeightGap.MONEY;
    timeSpendCtx.height = Bar.HEIGHT * HeightGap.MONEY;

    this._moneyChart = renderChart(
        moneyCtx,
        this._getMoneyChartData(),
        moneyChartConfig
    );

    this._transportChart = renderChart(
        transportCtx,
        this._getTransportChartData(),
        transportChartConfig
    );

    this._timeSpentChart = renderChart(
        timeSpendCtx,
        this._getTimeSpentChartData(),
        timeSpentChartConfig
    );
  }
}

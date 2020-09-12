import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {getTripDuration, getTotalDuration} from "../../utils/date-utils.js";
import SmartView from "../smart/smart.js";

const ChartName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`,
};

const CHART_TYPE = `horizontalBar`;

const Bar = {
  HEIGHT: 55,
  THICKNESS: 44,
  MIN_LENGTH: 50,
  BG_COLOR: `#ffffff`,
  HOVER_BG_COLOR: `#ffffff`,
};

const BarText = {
  COLOR: `#000000`,
  POSITION: `end`,
  ALIGN: `start`,
  FONT_SIZE: 13,
};

const BarTitle = {
  FONT_COLOR: `#000000`,
  FONT_SIZE: 23,
  POSITION: `left`,
};

const BarLabel = {
  FONT_COLOR: `#000000`,
  PADDING: 5,
  FONT_SIZE: 13,
  POSITION: `start`,
};

const createChartOptions = ({
  title,
  labels,
  barsData,
  valueFormatter,
}) => {

  return {
    plugins: [ChartDataLabels],
    type: CHART_TYPE,
    data: {
      labels,
      datasets: [{
        data: barsData,
        backgroundColor: Bar.BG_COLOR,
        hoverBackgroundColor: Bar.HOVER_BG_COLOR,
        anchor: BarLabel.POSITION,
        barThickness: Bar.THICKNESS,
        minBarLength: Bar.MIN_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: BarText.FONT_SIZE,
          },
          color: BarText.COLOR,
          anchor: BarText.POSITION,
          align: BarText.ALIGN,
          formatter: valueFormatter,
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: BarTitle.FONT_COLOR,
        fontSize: BarTitle.FONT_SIZE,
        position: BarTitle.POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: BarLabel.FONT_COLOR,
            padding: BarLabel.PADDING,
            fontSize: BarLabel.FONT_SIZE,
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
            drawBorder: false
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
  };
};

const createChartsData = (points) => {
  const waypointTypes = [];
  const waypoints = [...new Set(points.map((point)=> point.waypoint))];
  waypoints.forEach((waypoint) => {
    waypointTypes.push({waypoint,
      points: points.filter((point) => point.waypoint === waypoint)
    });
  });

  const moneyData = waypointTypes.map((type) => type.points.reduce((total, point) => total + point.price, 0));

  const transportCount = waypointTypes.map((i) => i.points.length);

  const getTotalTime = () => {
    return waypointTypes.map((i)=> {
      return i.points.reduce((total, point) =>
        total + getTripDuration(point.start, point.end), moment.duration(0));
    });
  };

  return {
    waypoints,
    money: moneyData,
    transport: transportCount,
    time: getTotalTime(),
  };
};


const createStatsItem = (name) => (
  `<div class="statistics__item statistics__item--${name.toLowerCase()}">
      <canvas class="statistics__chart  statistics__chart--${name.toLowerCase()}" width="900"></canvas>
  </div>`
);

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    ${Object.keys(ChartName).map(createStatsItem).join(``)}
  </section>`
);

const renderMoneyChart = (container, chartsData) => {
  const barsAmount = chartsData.waypoints.length;
  container.height = Bar.HEIGHT * barsAmount;

  return new Chart(container, createChartOptions({
    title: ChartName.MONEY,
    labels: chartsData.waypoints,
    barsData: chartsData.money,
    valueFormatter: (val) => `€ ${val}`,
  }));
};

const renderTransportChart = (container, chartsData) => {
  const barsAmount = chartsData.waypoints.length;
  container.height = Bar.HEIGHT * barsAmount;

  return new Chart(container, createChartOptions({
    title: ChartName.TRANSPORT,
    labels: chartsData.waypoints,
    barsData: chartsData.transport,
    valueFormatter: (val) => `${val}x`,
  }));
};

const renderTimeChart = (container, chartsData) => {
  const barsAmount = chartsData.waypoints.length;
  container.height = Bar.HEIGHT * barsAmount;

  return new Chart(container, createChartOptions({
    title: ChartName.TIME,
    labels: chartsData.waypoints,
    barsData: chartsData.time,
    valueFormatter: (val) => `${getTotalDuration(val)}`,
  }));
};

export default class Stats extends SmartView {

  constructor(points) {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
    this._setCharts(points);
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();
  }

  _setCharts(points) {
    if (this._moneyChart !== null) {
      this._moneyChart = null;
    }
    const chartsData = createChartsData(points);
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);
    this._moneyChart = renderMoneyChart(moneyCtx, chartsData);
    this._transportChart = renderTransportChart(transportCtx, chartsData);
    this._timeChart = renderTimeChart(timeCtx, chartsData);
  }
}

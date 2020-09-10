import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {getTimeOfTrip} from "../../utils/date-utils.js";
import SmartView from "../smart/smart.js";

const ChartName = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`,
};

const BAR_HEIGHT = 55;

const createStatsItem = (name) => (
  `<div class="statistics__item statistics__item--${name.toLowerCase()}">
      <canvas class="statistics__chart  statistics__chart--${name.toLowerCase()}" width="900"></canvas>
  </div>`
).trim();

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    ${Object.keys(ChartName).map(createStatsItem).join(``)}
  </section>`
);

const renderMoneyChart = (container, points) => {
  const waypoints = [...new Set(points.map((point)=> point.waypoint))];
  const waypointTypes = [];
  waypoints.forEach((waypoint) => {
    waypointTypes.push({waypoint,
      points: points.filter((point) => point.waypoint === waypoint)
    });
  });

  const totalMoney = waypointTypes.map((type) => type.points.reduce((total, point) => total + point.price, 0));

  container.height = BAR_HEIGHT * 6;
  return new Chart(container, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: waypoints,
      datasets: [{
        data: totalMoney,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
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
          minBarLength: 50
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

const renderTransportChart = (container, points) => {
  const waypointTypes = [];
  const waypoints = [...new Set(points.map((point)=> point.waypoint))];
  waypoints.forEach((waypoint) => {
    waypointTypes.push({waypoint,
      points: points.filter((point) => point.waypoint === waypoint)
    });
  });

  const getTransferCounts = () => waypointTypes.map((i) => i.points.length);

  container.height = BAR_HEIGHT * 4;
  return new Chart(container, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: waypoints,
      datasets: [{
        data: getTransferCounts(),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
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
          minBarLength: 50
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

const renderTimeChart = (container, points) => {
  const waypoints = [...new Set(points.map((point)=> point.waypoint))];
  const waypointTypes = [];
  waypoints.forEach((waypoint) => {
    waypointTypes.push({waypoint,
      points: points.filter((point) => point.waypoint === waypoint)
    });
  });


  const getTimeByType = () => {
    return waypointTypes.map((i)=> {
      return i.points.reduce((total, point) =>
        total + getTimeOfTrip(point.start, point.end), moment.duration(0));
    });
  };

  console.log(getTimeByType()[0].replace(/\r|\n/g, ``).trim());


  container.height = BAR_HEIGHT * 4;
  return new Chart(container, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: waypoints,
      datasets: [{
        data: getTimeByType(),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}`
        }
      },
      title: {
        display: true,
        text: `TIME`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
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
          minBarLength: 50
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
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);
    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._transportChart = renderTransportChart(transportCtx, points);
    this._timeChart = renderTimeChart(timeCtx, points);
  }
}

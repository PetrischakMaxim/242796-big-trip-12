import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from "../smart/smart.js";

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
);

const BAR_HEIGHT = 55;

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

export default class Stats extends SmartView {

  constructor(points) {
    super();

    this._moneyChart = null;
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
    this._moneyChart = renderMoneyChart(moneyCtx, points);
  }
}



export const PointType = {
  TRANSFER: [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`
  ],
  ACTIVITY: [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`,
  ],
};

export const {TRANSFER, ACTIVITY} = PointType;
export const POINT_LIST = [...TRANSFER, ...ACTIVITY];

export const BLANK_POINT = {
  waypoint: `bus`,
  price: 1200,
  info: {
    name: `Amsterdam`,
    description: `Amsterdam, a perfect place to stay with a family.`,
    pictures: [
      {src: `http://picsum.photos/300/200?r=0.8386231864924261`, description: `Amsterdam park`},
      {src: `http://picsum.photos/300/200?r=0.40116945351116184`, description: `Amsterdam biggest supermarket`},
      {src: `http://picsum.photos/300/200?r=0.4030889096915611`, description: `Amsterdam zoo`},
      {src: `http://picsum.photos/300/200?r=0.9796612528279129`, description: `Amsterdam park`}
    ]
  },
  start: new Date(),
  end: new Date(),
  offers: [
    {title: `Infotainment system`, price: 50},
    {title: `Order meal`, price: 100},
    {title: `Choose seats`, price: 190}
  ],
  isFavorite: false
};

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  ERROR: `ERROR`
};

export const Message = {
  LOADING: `Loading...`,
  NO_POINTS: `Click New Event to create your first point`,
  ERROR: `Error loading data, try again later..`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuTab = {
  TABLE: `Table`,
  STATS: `Stats`
};

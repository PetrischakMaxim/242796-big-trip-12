export const PointMessage = {
  LOADING: `Loading...`,
  NO_EVENTS: `Click New Event to create your first point`,
  ERROR: `Error loading data, try again later..`,
};

export const TRANSFERS = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
export const ACTIVITIES = [`Check-in`, `Sightseeing`, `Restaurant`];

export const PointGroupType = {
  TRANSFER: `Transfer`,
  ACTVITY: `Activity`,
};

export const pointGroupToTypes = {
  [PointGroupType.TRANSFER]: TRANSFERS,
  [PointGroupType.ACTVITY]: ACTIVITIES,
};

const pointGropTypeToPreposition = {
  [PointGroupType.TRANSFER]: `to`,
  [PointGroupType.ACTVITY]: `in`,
};

export const pointTypeToPreposition = {
  'taxi': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'bus': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'train': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'ship': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'transport': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'drive': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'flight': pointGropTypeToPreposition[PointGroupType.TRANSFER],
  'check-in': pointGropTypeToPreposition[PointGroupType.ACTVITY],
  'sightseeing': pointGropTypeToPreposition[PointGroupType.ACTVITY],
  'restaurant': pointGropTypeToPreposition[PointGroupType.ACTVITY],
};

export const pointTypeToEmoji = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛`,
  'restaurant': `🍴`,
};

export const SortType = {
  EVENT: `Event`,
  TIME: `Time`,
  PRICE: `Price`,
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
  ERROR: `ERROR`,
};

export const FilterType = {
  EVERYTHING: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`,
};

export const TabItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

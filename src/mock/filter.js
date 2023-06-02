import {filter} from '../utils.js';

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filterTasks]) => ({
    name: filterName,
    count: filterTasks(points).length,
  }),
);

import dayjs from 'dayjs';
import {FilterType} from './const';

const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const translatePointDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');

const isPointExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

const isPointRepeating = (repeating) => Object.values(repeating).some(Boolean);

function makeDefaultDayConfig() {
  return {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  };
}

const isPointExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

const filter = {
  [FilterType.ALL]: (points) => points.filter((point) => !point.isArchived),
  [FilterType.OVERDUE]: (points) => points.filter((point) => isPointExpired(point.dueDate) && !point.isArchived),
  [FilterType.TODAY]: (points) => points.filter((point) => isPointExpiringToday(point.dueDate) && !point.isArchived),
  [FilterType.FAVORITES]: (points) => points.filter((point) => point.isFavorite && !point.isArchived),
  [FilterType.REPEATING]: (points) => points.filter((point) => isPointRepeating(point.repeating) && !point.isArchived),
  [FilterType.ARCHIVED]: (points) => points.filter((point) => point.isArchived),
};

export {getRandomInt, translatePointDueDate, isPointExpired, isPointRepeating, makeDefaultDayConfig, filter, isPointExpiringToday};

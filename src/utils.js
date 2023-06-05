import dayjs from 'dayjs';
import {FilterType} from './const';

const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const translatePointDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YY mm:ss');

const isPointFuture = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'D');

const isPointExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

const filter = {
  [FilterType.ALL]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dueDate)),
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInt, translatePointDueDate, filter, isPointExpiringToday, updateItem, isPointFuture};

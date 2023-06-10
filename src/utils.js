import dayjs from 'dayjs';
import {FilterType} from './const';

const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const translatePointDueDate = (date) => dayjs(date).format('DD/MM/YY/HH:mm');

const translateDatetoDay = (date) => dayjs(date).format('MMMM DD');

const translateDatetoTime = (date) => dayjs(date).format('HH:mm');


const isPointFuture = (startDate) => startDate && dayjs().isBefore(startDate, 'D');

const isPointExpiringToday = (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.startDate)),
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

const sortPointByDate = (pointA, pointB) => (dayjs(pointA.startDate).diff(dayjs(pointB.startDate)));

const sortPointByPrice = (pointA, pointB) => ( pointB.price - pointA.price);

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'DD/MM/YY/HH/mm');

export {getRandomInt, translatePointDueDate, isPointFuture, isPointExpiringToday, filter, updateItem, sortPointByDate, sortPointByPrice, isDatesEqual, translateDatetoDay, translateDatetoTime};

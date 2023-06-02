import dayjs from 'dayjs';
import {getRandomInt} from '../utils.js';
import {COLORS} from '../const.js';
import { makeDefaultDayConfig } from '../utils.js';
import {nanoid} from 'nanoid';

const generateDescription = () => {
  const descriptions = [
    'Очень информативное описание',
    'Пустое описание',
    'Невероятно полезное описание',
  ];

  const randomIndex = getRandomInt(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateDate = () => {
  const isDate = Boolean(getRandomInt(0, 1));

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInt(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateRepeating = () => ({
  mon: false,
  tue: false,
  wed: Boolean(getRandomInt(0, 1)),
  thu: false,
  fri: Boolean(getRandomInt(0, 1)),
  sat: false,
  sun: false,
});

const getRandomColor = () => {
  const randomIndex = getRandomInt(0, COLORS.length - 1);

  return COLORS[randomIndex];
};

export const generatePoint = () => {
  const dueDate = generateDate();
  const days = generateRepeating();
  const repeating = dueDate === null
    ? generateRepeating
    : makeDefaultDayConfig(days);

  return {
    id: nanoid(),
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchived: Boolean(getRandomInt(0, 1)),
    isFavorited: Boolean(getRandomInt(0, 1)),
  };
};

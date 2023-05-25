import dayjs from 'dayjs';
import {getRandomInt} from '../utils.js';
import {COLORS} from '../const.js';

const generateDescription = () => {
  const descriptions = [
    'Отличное место назначения',
    'Пустое описание',
    'Очень информативное описание',
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
  mo: false,
  tu: false,
  we: Boolean(getRandomInt(0, 1)),
  th: false,
  fr: Boolean(getRandomInt(0, 1)),
  sa: false,
  su: false,
});

const getRandomColor = () => {
  const randomIndex = getRandomInt(0, COLORS.length - 1);

  return COLORS[randomIndex];
};

export const generatePoint = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
    };

  return {
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchived: Boolean(getRandomInt(0, 1)),
    isFavorited: Boolean(getRandomInt(0, 1)),
  };
};

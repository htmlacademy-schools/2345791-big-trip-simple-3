import dayjs from 'dayjs';
import {getRandomInt} from '../utils.js';
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


export const generatePoint = () => {
  const dueDate = generateDate();

  return {
    id: nanoid(),
    description: generateDescription(),
    dueDate
  };
};

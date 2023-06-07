import dayjs from 'dayjs';
import {getRandomInt} from '../utils.js';
import {nanoid} from 'nanoid';

const generateName = () => {
  const names = [
    'Очень информативное описание',
    'Пустое описание',
    'Невероятно полезное описание',
  ];

  const randomIndex = getRandomInt(0, names.length - 1);

  return names[randomIndex];
};

const generateDestination = () => {
  const destinations = [
    'Назначение 1',
    'Пункт',
    'Лондон',
    'Москва'
  ];

  const randomIndex = getRandomInt(0, destinations.length - 1);

  return destinations[randomIndex];
};

const generateType = () => {
  const types = [
    'taxi',
    'bus',
    'train',
    'flight'
  ];

  const randomIndex = getRandomInt(0, types.length - 1);

  return types[randomIndex];
};

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInt(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generatePrice = () => {
  const maxPrice = 100;
  const minPrice = 10;
  return getRandomInt(minPrice, maxPrice);
};

const generateOffer = () => {
  const offers = {
    'Order an Uber': 20,
    'Book a hotel': 40,
    'Hire a guide': 50
  };

  const randomIndex = getRandomInt(0, Object.keys(offers).length - 1);
  const offer = Object.keys(offers)[randomIndex];
  const cost = Object.values(offers)[randomIndex];

  return {[offer]: cost};
};

export const generatePoint = () => ({
  id: nanoid(),
  name: generateName(),
  type: generateType(),
  destination: generateDestination(),
  startDate: generateDate(),
  endDate: generateDate(),
  price: generatePrice(),
  offers: generateOffer()
});

import dayjs from 'dayjs';

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

export {getRandomInt, translatePointDueDate, isPointExpired, isPointRepeating, makeDefaultDayConfig};

import FilterView from './view/filterView';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/boardPresenter';
import FilterPresenter from './presenter/filterPresenter.js';
import PointsModel from './model/pointModel';
import FilterModel from './model/filterModel.js';

const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];

const siteMainElement = document.querySelector('.page-body__page-main');
const tripControls = document.querySelector('.trip-controls__filters');
const tripElement = siteMainElement.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(tripElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, pointsModel);

render(new FilterView(filters), tripControls);

const handleNewPointFormClose = () => {
  newEventButton.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newEventButton.element.disabled = true;
};

newEventButton.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
boardPresenter.init();

import FilterView from './view/filterView';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/boardPresenter';
import PointsModel from './model/pointModel';
import {generateFilter} from './mock/filter.js';

const siteMainElement = document.querySelector('.page-body__page-main');
const tripControls = document.querySelector('.trip-controls__filters');
const tripElement = siteMainElement.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter(tripElement, pointsModel);

const filters = generateFilter(pointsModel.points);

render(new FilterView(filters), tripControls);

newEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
});

boardPresenter.init();

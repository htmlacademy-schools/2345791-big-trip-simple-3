import NewPointButtonView from './view/createPointView';
import FilterView from './view/filterView';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/boardPresenter';
import PointsModel from './model/pointModel';
import {generateFilter} from './mock/filter.js';

const siteMainElement = document.querySelector('.page-body__page-main');
const tripControls = document.querySelector('.trip-controls__filters');
const tripElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter(tripElement, pointsModel);

const filters = generateFilter(pointsModel.points);

render(new NewPointButtonView(), tripElement);
render(new FilterView(filters), tripControls);

boardPresenter.init();

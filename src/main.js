import NewPointButtonView from './view/createPointView';
import FilterView from './view/filterView';
import {render} from './render.js';
import BoardPresenter from './presenter/boardPresenter';
import PointsModel from './model/pointModel';

const siteMainElement = document.querySelector('.page-body__page-main');
const tripControls = document.querySelector('.trip-controls__filters');
const tripElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter();

render(new NewPointButtonView(), tripElement);
render(new FilterView(), tripControls);

boardPresenter.init(tripElement, pointsModel);

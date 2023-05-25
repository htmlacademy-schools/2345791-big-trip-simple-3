import NewPointButtonView from './view/createPointView';
import FilterView from './view/filterView';
import {render} from './render.js';
import BoardPresenter from './presenter/boardPresenter';
import PointsModel from './model/pointModel';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter();

render(new NewPointButtonView(), siteHeaderElement);
render(new FilterView(), siteMainElement);

boardPresenter.init(siteMainElement, pointsModel);

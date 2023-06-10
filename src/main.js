import {render} from './framework/render.js';
import BoardPresenter from './presenter/boardPresenter';
import FilterPresenter from './presenter/filterPresenter.js';
import PointsModel from './model/pointModel';
import FilterModel from './model/filterModel.js';
import PointsApiService from './pointsApiService';
import NewPointButtonView from './view/newPointButtonView';
import GetInfoApiService from './getInfoApiService';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteMainElement = document.querySelector('.trip-main');
const tripControls = document.querySelector('.trip-controls__filters');
const tripElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION), new GetInfoApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(tripElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControls, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

newPointButtonComponent.element.addEventListener('click', handleNewPointButtonClick);

filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteMainElement);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });

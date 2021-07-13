import icons from 'url:../../img/icons.svg'; // Parcel 2
import View from './View.js';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _form = document.querySelector('.upload');
  _btnClost = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _message = 'Successfully adding the recipe!';

  constructor() {
    super();
    this._addHandlerHideWindow();
    this._addHandlerShowWindow();
  }

  toggleDisplay = function () {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  };

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleDisplay.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClost.addEventListener('click', this.toggleDisplay.bind(this));
    this._overlay.addEventListener('click', this.toggleDisplay.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // pass a form into the FormData
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

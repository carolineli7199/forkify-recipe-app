import icons from 'url:../../img/icons.svg'; // Parcel 2
import previewView from './previewView.js';
import View from './View.js';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe is found from your query! please try again :)';
  _data;

  _generateMarkup() {
    const result = this._data
      .map(result => previewView.render(result, false))
      .join('');
    console.log(this._data[0]);
    return result;
  }
}

export default new ResultView();

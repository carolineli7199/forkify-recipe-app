import icons from 'url:../../img/icons.svg'; // Parcel 2
import previewView from './previewView.js';
import View from './View.js';
class BookmarkstView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message;

  addHandlerLoad(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const result = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    return result;
  }
}

export default new BookmarkstView();

import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import bookmarksView from './view/bookmarksView.js';
import paginationView from './view/paginationView.js';
import addRecipeView from './view/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC_NEW_RECIPE } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // (0) update result view to mark selected search result
    resultView.update(model.getSearchResultPage(model.state.search.page));
    bookmarksView.update(model.state.bookmarks);

    // (1) load recipe
    await model.loadRecipe(id);
    console.log(model.state.recipe);

    // (2) rendering data
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResult(query);

    // 3) render result
    resultView.render(model.getSearchResultPage(1));

    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) render NEW result
  resultView.render(model.getSearchResultPage(goToPage));

  // 4) render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlBookmark = function () {
  // update the model
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);

  // render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlServings = function (servings) {
  // update the recipe servings
  model.updateSearvings(servings);

  // re-render the recipe according to serving size
  recipeView.update(model.state.recipe);
};

const controlInitBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    await model.addNewRecipe(newRecipe);
    console.log(model.state.recipe);

    // render the recipe to page
    recipeView.render(model.state.recipe);

    // set successful message
    addRecipeView.renderMessage();

    // update the url id to the current recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // close form window
    setTimeout(() => {
      addRecipeView.toggleDisplay();
    }, TIMEOUT_SEC_NEW_RECIPE * 1000);
  } catch (e) {
    console.error(e);
    addRecipeView.renderError(e);
  }
};

const init = function () {
  bookmarksView.addHandlerLoad(controlInitBookmark);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdataServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSesarch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
};

init();

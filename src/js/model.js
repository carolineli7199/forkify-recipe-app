import { async } from 'regenerator-runtime';
import { API_URL, KEY } from './config';
import { AJAX } from './helper';
import { RES_PER_PAGE } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    Publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        Publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    console.log(err);
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; //9
  return state.search.results.slice(start, end);
};

export const updateSearvings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  saveBookmarks();
};

export const deleteBookmark = function (recipe) {
  const index = state.bookmarks.findIndex(el => el.id === recipe.id);
  state.bookmarks.splice(index, 1);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  saveBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// for debugging use only
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const addNewRecipe = async function (recipe) {
  const ingredients = Object.entries(recipe)
    .filter(pair => pair[0].startsWith('ingredient') && pair[1] !== '')
    .map(pair => {
      const ing = pair[1].split(',').map(ele => ele.trim());
      if (ing.length !== 3) throw new Error('invalid ingredient format');
      return {
        quantity: ing[0] ? +ing[0] : null,
        unit: ing[1],
        description: ing[2],
      };
    });

  recipe = {
    id: '',
    title: recipe.title,
    publisher: recipe.publisher,
    source_url: recipe.sourceUrl,
    image_url: recipe.image,
    servings: +recipe.servings,
    cooking_time: +recipe.cookingTime,
    ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
};

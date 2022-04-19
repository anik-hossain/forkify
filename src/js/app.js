import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { clearLoader, elements, loader } from './views/base';
import Recipe from './models/Recipe';

/**
 * ***** Global state of the application
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - LIked recipes
 */

const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
  // 1. Get query from dom
  const query = searchView.getInput();
  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    loader(elements.searchRes);

    try {
      // 4. Search for recipes
      await state.search.getResult();

      // 5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.recipes);
    } catch (error) {
      console.log(error.message);
      clearLoader();
    }
  }
};

// Event
elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.recipes, goToPage);
  }
});

/**
 * Recipe Controller
 */

const RecipeController = async () => {
  const id = window.location.hash.replace('#', '');
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    loader(elements.recipe);
    if (state.search) searchView.highlightedSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // 1. Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // 2. Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // 3. Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log(error);
      clearLoader();
      alert("Can't load recipe something went wrong :(");
    }
  }
};

['hashchange', 'load'].forEach((event) =>
  addEventListener(event, RecipeController)
);

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button i8s clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button i8s clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
});

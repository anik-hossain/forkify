import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { clearLoader, elements, loader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      clearLoader();
      alert("Can't load recipe something went wrong :(");
    }
  }
};

// List Controller

const ListController = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredients to the list amd UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

['hashchange', 'load'].forEach((event) =>
  addEventListener(event, RecipeController)
);

// Handle delete and update list item event
elements.shoppingList.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // Handle delete item
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  }
  // Handle the count update
  else if (
    e.target.matches('.shopping__count-value, .shopping__count-value *')
  ) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Likes Controller
const likeController = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);
  } else {
    // Remove like from state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    ListController();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    likeController();
  }
});

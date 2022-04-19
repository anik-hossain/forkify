import Search from './models/Search';
import * as searchView from './views/searchView';
import { clearLoader, elements, loader } from './views/base';

/**
 * ***** Global state of the application
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - LIked recipes
 */

const state = {};

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

    // 4. Search for recipes
    await state.search.getResult();

    // 5. Render results on UI
    clearLoader();
    searchView.renderResults(state.search.recipes);
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

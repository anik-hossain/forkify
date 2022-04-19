function qSelector(selector = '') {
  return document.querySelector(selector);
}

export const elements = {
  searchForm: qSelector('.search'),
  searchInput: qSelector('.search__field'),
  resultList: qSelector('.results__list'),
  searchRes: qSelector('.results'),
  searchResPages: qSelector('.results__pages'),
  recipe: qSelector('.recipe'),
};

export const elementStrings = {
  loader: 'loader',
};

export const loader = (parent) => {
  const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = qSelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};

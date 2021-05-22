import createItemCategorySpecification from './create-item-category.post';
import getItemCategoriesSpecification from './get-item-categories.get';

export const itemCategoriesPath = {
  '/item-categories': {
    post: createItemCategorySpecification,
    get: getItemCategoriesSpecification,
  },
};

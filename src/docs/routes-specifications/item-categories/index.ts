import createItemCategorySpecification from './create-item-category.post';

export const itemCategoriesPath = {
  '/item-categories': {
    post: createItemCategorySpecification,
  },
};

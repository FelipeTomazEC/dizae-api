import addItemToLocationSpecifications from './add-item-to-location.post';
import createLocationSpecifications from './create-location.post';
import getItemsFromLocationSpecifications from './get-items-from-location.get';

export const locationPaths = {
  '/locations': {
    post: createLocationSpecifications,
  },
  '/locations/{locationId}/items': {
    post: addItemToLocationSpecifications,
    get: getItemsFromLocationSpecifications,
  },
};

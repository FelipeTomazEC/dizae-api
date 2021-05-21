import addItemToLocationSpecifications from './add-item-to-location.post';
import createLocationSpecifications from './create-location.post';
import getItemsFromLocationSpecifications from './get-items-from-location.get';
import getAllLocationsInfoSpecifications from './get-all-locations-info.get';

export const locationPaths = {
  '/locations': {
    post: createLocationSpecifications,
    get: getAllLocationsInfoSpecifications,
  },
  '/locations/{locationId}/items': {
    post: addItemToLocationSpecifications,
    get: getItemsFromLocationSpecifications,
  },
};

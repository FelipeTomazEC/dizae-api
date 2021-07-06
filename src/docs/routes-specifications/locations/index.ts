import addItemToLocationSpecifications from './add-item-to-location.post';
import createLocationSpecifications from './create-location.post';
import getLocationInfoSpecifications from './get-location-info.get';
import getAllLocationsInfoSpecifications from './get-all-locations-info.get';

export const locationPaths = {
  '/locations': {
    post: createLocationSpecifications,
    get: getAllLocationsInfoSpecifications,
  },
  '/locations/{location_id}': {
    get: getLocationInfoSpecifications,
  },
  '/locations/{locationId}/items': {
    post: addItemToLocationSpecifications,
  },
};

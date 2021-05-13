import addItemToLocationSpecifications from './add-item-to-location.post';
import createLocationSpecifications from './create-location.post';

export const locationsPaths = {
  '/locations': createLocationSpecifications,
  '/locations/{locationId}/items': addItemToLocationSpecifications,
};

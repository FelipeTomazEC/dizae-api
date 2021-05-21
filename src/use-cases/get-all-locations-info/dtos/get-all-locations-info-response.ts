type LocationInfo = {
  id: string;
  name: string;
  numberOfItems: number;
};

export interface GetAllLocationsInfoResponse {
  locations: LocationInfo[];
}

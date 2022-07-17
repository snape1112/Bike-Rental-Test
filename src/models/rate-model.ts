export const CollectionRate = 'rate';

export type RateProperties = {
  id: string;
  userId: string;
  bikeId: string;
  rating: number;
};

export type IRateFormInputs = Omit<RateProperties, 'id'>;



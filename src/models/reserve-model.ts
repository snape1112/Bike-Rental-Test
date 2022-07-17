export const CollectionReserve = 'reserves';

export type ReserveProperties = {
  id: string;
  userId: string;
  bikeId: string;
  fromDate: string;
  toDate: string;
};

export type IReserveFormInputs = Omit<ReserveProperties, 'id'>;

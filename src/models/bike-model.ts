export const CollectionBike = 'bikes';

export type BikeProperties = {
  id: string;
  model: string;
  color: string;
  location: string;
  rating: number;
  isAvailable: EnumIsAvailable;
};

export enum EnumModel {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum EnumColor {
  R = 'Red',
  B = 'Blue',
  G = 'Green',
}

export enum EnumLocation {
  AL = 'Alabama',
  AK = 'Alaska',
  AZ = 'Arizona',
  AR = 'Arkansas',
  CA = 'California',
  CO = 'Colorado',
  CT = 'Connecticut',
  DE = 'Delaware',
  FL = 'Florida',
}

export enum EnumIsAvailable {
  true = 'true',
  false = 'false',
}

export type IBikeFormInputs = Omit<BikeProperties, 'id'>;

export type IBikeFormInputsDisabled = {
  id?: boolean;
  model?: boolean;
  color?: boolean;
  location?: boolean;
  rating?: boolean;
  isAvailable?: boolean;
};

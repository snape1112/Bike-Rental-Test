import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { CollectionBike, BikeProperties, IBikeFormInputs, IRentBikeProperties } from '../models/bike-model';
import { firebaseApp } from './firebase';

const db = getFirestore(firebaseApp);

export async function createBike(bike: IBikeFormInputs): Promise<BikeProperties> {
  const bikeRef = await addDoc(collection(db, CollectionBike), bike);

  return { ...bike, id: bikeRef.id as string };
}

export async function getAllBikes() {
  const querySnapshot = await getDocs(collection(db, CollectionBike));

  const bikes: BikeProperties[] = [];

  querySnapshot.forEach(doc => {
    bikes.push({ id: doc.id, ...doc.data() } as BikeProperties);
  });

  return bikes;
}

export const deleteBike = async (id: string) =>
  await deleteDoc(doc(db, CollectionBike, id));

export const updateBike = async ({
  id,
  ...bike
}: BikeProperties): Promise<BikeProperties> => {
  const bikeRef = doc(db, CollectionBike, id);

  await setDoc(bikeRef, bike, { merge: true });

  return { ...bike, id };
};

export const rentBike = async ({ bikeId, ...rent }: IRentBikeProperties ) => {
  const bikeRef = doc(db, CollectionBike, bikeId);

  await setDoc(bikeRef, { rent, is_available: false }, { merge: true });

  return rent
}

export const cancelRentedBike = async (bikeId: string) => {
  const bikeRef = doc(db, CollectionBike, bikeId);

  await setDoc(bikeRef, { rent: {}, is_available: true }, { merge: true });
}

export async function getBikeRentals() {
  const q = query(collection(db, CollectionBike), where("is_available", "==", false));
  const querySnapshot = await getDocs(q);

  const bikes: BikeProperties[] = [];

  querySnapshot.forEach(doc => {
    bikes.push({ id: doc.id, ...doc.data() } as BikeProperties);
  });

  return bikes;
}
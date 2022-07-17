import {
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  runTransaction,
  query,
  where
} from 'firebase/firestore';
import { CollectionReserve, ReserveProperties, IReserveFormInputs } from '../models/reserve-model';
import { CollectionBike } from '../models/bike-model';
import { firebaseApp } from './firebase';

const db = getFirestore(firebaseApp);

export async function getAllReserves() {
  const querySnapshot = await getDocs(collection(db, CollectionReserve));

  const bikes: ReserveProperties[] = [];

  querySnapshot.forEach(doc => {
    bikes.push({ id: doc.id, ...doc.data() } as ReserveProperties);
  });

  return bikes;
}

export async function createReserve(reserve: IReserveFormInputs) {
  try {
    const reserveRef = doc(collection(db, CollectionReserve));
    const bikeRef = doc(db, CollectionBike, reserve.bikeId);

    const result = await runTransaction(db, async (transaction) => {
      transaction.set(reserveRef, reserve);
      transaction.update(bikeRef, {isAvailable: false});

      return { ...reserve, id: reserveRef.id as string };
    });
    console.log("here", result);
  } catch (e) {
    console.error(e);
  }
}

export const cancelReserve = async (userId: string, bikeId: string) => {
  try {
    const querySnapshot = await getDocs(query(collection(db, CollectionReserve), ...[where("userId", "==", userId), where("bikeId", "==", bikeId)]));
    const bikeRef = doc(db, CollectionBike, bikeId);

    await runTransaction(db, async (transaction) => {
      querySnapshot.forEach(doc => {
        transaction.delete(doc.ref);
      });
      transaction.update(bikeRef, {isAvailable: true});
    });
  } catch (e) {
    console.error(e);
  }
}

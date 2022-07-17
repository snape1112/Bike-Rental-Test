import {
  doc,
  collection,
  getDocs,
  getFirestore,
  query, 
  where,
  runTransaction
} from 'firebase/firestore';
import { CollectionBike } from '../models/bike-model';
import { CollectionRate, RateProperties, IRateFormInputs } from '../models/rate-model';
import { firebaseApp } from './firebase';

const db = getFirestore(firebaseApp);

export async function saveRate(rate: IRateFormInputs)/*: Promise<RateProperties>*/ {
  const querySnapshot = await getDocs(query(collection(db, CollectionRate), ...[where("bikeId", "==", rate.bikeId)]));
  let sumRating: number = 0;
  querySnapshot.forEach((doc) => {
    sumRating += doc.data().rating; 
  });

  const bikeRef = doc(collection(db, CollectionBike), rate.bikeId);
  const rateRef = doc(collection(db, CollectionRate));

  try {
    const result = await runTransaction(db, async (transaction) => {
      transaction.set(rateRef, rate);
      transaction.update(bikeRef, {rating: (sumRating + rate.rating) / (querySnapshot.docs.length + 1)});

      return { ...rate, id: rateRef.id as string };
    });
    console.log("here", result);
  } catch (e) {
    console.error(e);
  }
}

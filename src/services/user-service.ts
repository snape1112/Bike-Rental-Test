import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
import {
  CollectionUser,
  CreateUserProperties,
  CreateUserWithCredentialsProperties,
  ISaveUser,
  UserProperties
} from '../models/user-model';
import { firebaseApp } from './firebase';



const db = getFirestore(firebaseApp);

export const getUserByEmail = async (email: string) => {
  const q = query(collection(db, CollectionUser), where('email', '==', email));

  let user: UserProperties = {} as UserProperties;

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    user = { ...doc.data(), id: doc.id } as UserProperties;
  });

  return user;
};


export const createUserWithCredentials = async ({
  password,
  ...rest
}: CreateUserWithCredentialsProperties) => {
  console.log(rest)
  const userEmailResponse = await getUserByEmail(rest.email)

  if(userEmailResponse.id) {
    throw new Error ("User already exists")
  }

  const auth = getAuth(firebaseApp)
  const userResponse = await createUser(rest);
  
  createUserWithEmailAndPassword(auth, rest.email, password)
  

  return userResponse;
};

export const createUser = async (user: CreateUserProperties) => {
  const docRef = await addDoc(collection(db, CollectionUser), user);

  return { ...user, id: docRef.id };
};

export const saveUser = async ({ id, ...rest }: ISaveUser) => {
  const userRef = doc(db, CollectionUser, id);

  setDoc(userRef, rest, { merge: true });

  return { ...rest, id };
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, CollectionUser));

  const users: UserProperties[] = [];

  querySnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() } as UserProperties);
  });

  return users;
};

export const deleteUser = async (id: string) => {
  const userRef = doc(db, CollectionUser, id);

  await deleteDoc(doc(db, CollectionUser, id));
};

export const login = async (email: string, password: string) => {
  const auth = getAuth(firebaseApp)

  return await signInWithEmailAndPassword(auth, email, password)
};
import Router from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import React, { createContext, useEffect, useState } from 'react';
import { UserProperties } from '../models/user-model';
import { getUserByEmail, login } from '../services/user-service';

interface AuthContextProperties {
  signIn: (email: string, password: string) => Promise<void>;
  user: UserProperties;
}

export const AuthContext = createContext<AuthContextProperties>(
  {} as AuthContextProperties,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState({} as UserProperties);

  async function signIn(email: string, password: string) {
    try {
      const response = await getUserByEmail(email);

      if (response) {
        await login(email, password);

        setCookie(undefined, 'bikerentals.auth', JSON.stringify(response));

        setUser(response as UserProperties);

        Router.push('/');
      }
    } catch (err) {
      console.log(err);
      alert('user not found');
    }
  }

  useEffect(() => {
    let { 'bikerentals.auth': auth } = parseCookies() as any;
    try {
      if (!auth) {
        Router.push('/sign-in');
      }
      auth = JSON.parse(auth);
      console.log(auth, "auth")

      const userParsed = {
        role: auth?.role,
        name: auth?.name,
        email: auth?.email,
        id: auth?.id,
      };

      setUser(userParsed);
    } catch (err) {
      Router.push('/sign-in');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

import React from 'react';
import { Metadata } from 'next';
import Auth from './main';

export const metadata: Metadata = {
  title: 'Coming Soon | BKK SMK NEGERI 1 PURWOSARI',
  description: 'Coming Soon | BKK SMK NEGERI 1 PURWOSARI',
};

const AuthPage = () => {
  return <Auth/>;
};

export default AuthPage;

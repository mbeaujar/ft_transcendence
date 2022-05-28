import { createContext } from 'react';
import { IUser } from '../interface/user.interface';

export const UserContext = createContext<{
  isLogged: boolean;
  user: IUser | null;
  googleAuth: boolean;
}>({ isLogged: false, user: null, googleAuth: false });

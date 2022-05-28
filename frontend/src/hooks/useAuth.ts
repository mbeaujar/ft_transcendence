import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { IUser } from '../interface/user.interface';
import { checkIsLogged } from '../utils';

export type UseAuthType = {
  isLogged: boolean;
  user: IUser | null;
  googleAuth: boolean;
};

export const useAuth = (): UseAuthType => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [googleAuth, setGoogleAuth] = useState<boolean>(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { logged, googleAuth2 } = await checkIsLogged();
        setUser(logged);
        setGoogleAuth(googleAuth2);
      } catch (error) {
        console.log(error);
      }
    };

    const cookie = Cookies.get('access_token');
    if (cookie) {
      setIsLogged(true);
      getUserData();
    }
  }, [isLogged]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    setIsLogged(false);
  };

  return { isLogged, user, googleAuth };
};

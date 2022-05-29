import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { IUser } from '../interface/user.interface';
import { checkIsLogged, parseJwtCookie } from '../utils';
import api from '../apis/api';
import { toast } from 'react-toastify';
import axios from 'axios';

export type UseAuthType = {
  isLoading: boolean;
  isLogged: boolean;
  user: IUser | null;
  googleAuth: boolean;
  twofaCode: string;
  need2FaCode: boolean | null;
  twoFaDone: boolean;
  handleChange2faCode: (event: React.FormEvent<HTMLInputElement>) => void;
  handleSubmitForm2faCode: () => Promise<void>;
  handleLogout: () => void;
};

export const useAuth = (): UseAuthType => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [googleAuth, setGoogleAuth] = useState<boolean>(false);
  const [twofaCode, setTwofaCode] = useState<string>('');
  const [need2FaCode, setNeed2FaCode] = useState<boolean | null>(null);
  const [twoFaDone, setTwoFaDone] = useState<boolean>(false);

  const getUserData = async () => {
    try {
      const { userData, googleAuth2 } = await checkIsLogged();
      setUser(userData);
      setGoogleAuth(googleAuth2);
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const cookie = Cookies.get('access_token');
    if (cookie) {
      setNeed2FaCode(parseJwtCookie(cookie).twoFactorAuthenticatedEnabled);
      if (need2FaCode === false) {
        setTwoFaDone(true);
      }
      if (twoFaDone) {
        getUserData();
        setIsLogged(true);
      }
    }
    setIsLoading(false);
  }, [isLogged, need2FaCode, twoFaDone]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    setIsLogged(false);
    setNeed2FaCode(null);
    setTwofaCode('');
  };

  const handleSubmitForm2faCode = async () => {
    try {
      setIsLoading(true);
      const code = await api.post('/auth/2fa/authenticate', {
        code: twofaCode,
      });
      await getUserData();
      setTwoFaDone(true);
    } catch (error) {
      toast.error('Wrong code');
      setIsLoading(false);
    }
  };

  const handleChange2faCode = (event: React.FormEvent<HTMLInputElement>) => {
    var value = event.currentTarget.value;
    setTwofaCode(value);
  };

  return {
    twoFaDone,
    isLoading,
    user,
    googleAuth,
    isLogged,
    need2FaCode,
    handleLogout,
    twofaCode,
    handleSubmitForm2faCode,
    handleChange2faCode,
  };
};

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../apis/api';
import { IUser } from '../interface/user.interface';
import { is2fa, isLogged } from '../utils';

export const useApp = () => {
  const [user, setUser] = useState<IUser>();
  const [refresh, setRefresh] = useState<number>(0);
  const [googleAuth, setGoogleAuth] = useState<boolean>(true);
  const [twofaCode, setTwofaCode] = useState<string>('');
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    'Enter the 6 digit code',
  );

  const login = async () => {
    try {
      const user = await isLogged();
      const googleAuth = await is2fa();
      setUser(user);
      setGoogleAuth(googleAuth);
    } catch (error) {
      setGoogleAuth(true);
    }
  };

  useEffect(() => {
    login();
  }, [refresh]);

  return {};
};

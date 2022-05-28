import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../apis/api';
import { IUser } from '../interface/user.interface';
import { is2fa, isLogged } from '../utils';
import useLocalStorage from 'use-local-storage';
import { checkIsLogged } from '../utils';

export const useApp = () => {
  const [user, setUser] = useState<IUser>();
  const [refresh, setRefresh] = useState<number>(0);
  const [googleAuth, setGoogleAuth] = useState<boolean>(true);
  const [twofaCode, setTwofaCode] = useState<string>('');
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    (async () => {
      try {
        const { logged, googleAuth2 } = await checkIsLogged();
        setUser(logged);
        setGoogleAuth(googleAuth2);
        console.log({ googleAuth2 });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [refresh]);

  function handleSubmitForm2faCode() {
    api
      .post('/auth/2fa/authenticate', { code: twofaCode })
      .then(() => {
        setRefresh(refresh + 1);
      })
      .catch(() => {
        toast.error('Wrong code');
      });
  }

  function handleChange2faCode(event: React.FormEvent<HTMLInputElement>) {
    var value = event.currentTarget.value;
    setTwofaCode(value);
  }

  return {
    theme,
    user,
    setTheme,
    googleAuth,
    twofaCode,
    handleChange2faCode,
    handleSubmitForm2faCode,
  };
};

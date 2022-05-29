import api from '../apis/api';


export const getUser = async () => {
  const { data } = await api.get('/auth/status');
  return data;
};

export const is2fa = async () => {
  const { data } = await api.get('/auth/authenticated');
  return data;
};

export const checkIsLogged = async () => {
  const userData = await getUser();
  const googleAuth2 = await is2fa();
  return { userData, googleAuth2 };
};

import api from '../apis/api';

export const isLogged = async () => {
  const { data } = await api.get('/auth/status');
  return data;
};

export const is2fa = async () => {
  const { data } = await api.get('/auth/authenticated');
  return data;
};

export const handleSubmitForm2faCode = async () => {};

export const handleChange2faCode = async (
  event: React.FormEvent<HTMLInputElement>,
) => {};

// function handleSubmitForm2faCode() {
//   api
//     .post("/auth/2fa/authenticate", { code: twofaCode })
//     .then((response) => {
//       // Notes: 0 (ZERO)
//       // window.location.reload();
//     })
//     .catch((reject) => {
//       toast.error("Wrong code");
//     });
// }

// function handleChange2faCode(event: React.FormEvent<HTMLInputElement>) {
//   var value = event.currentTarget.value;
//   setTwofaCode(value);
// }

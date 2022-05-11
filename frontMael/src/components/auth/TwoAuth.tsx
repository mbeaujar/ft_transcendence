import React, { useState } from 'react';
import api from '../../apis/api';
import Input from '../chat/Input';
import { IUser } from '../interface/user.interface';
import './TwoAuth.css';

interface Props {
  user?: IUser;
  setUser: any;
}

const TwoAuth: React.FC<Props> = (props: Props) => {
  const [qrcode, setQrcode] = useState<any>(null);

  console.log('is two factor', props.user?.isTwoFactorEnabled);
  console.log('user', props?.user);
  return (
    <div className="container">
      <div className="blockAuth-left">
        <button
          onClick={() => {
            api
              .post('/auth/2fa/generate', {}, { responseType: 'blob' })
              .then(response => setQrcode(response.data))
              .catch(reject => console.log(reject));
          }}
        >
          Generate QR code
        </button>
        {qrcode ? <img src={URL.createObjectURL(qrcode)} /> : null}
      </div>
      <div className="blockAuth-right">
        <Input
          label="enable"
          onSubmit={(text: string) => {
            api.post('/auth/2fa/enable', { code: text });
          }}
        />
        <Input
          label="disable"
          onSubmit={(text: string) => {
            api.post('/auth/2fa/disable', { code: text });
          }}
        />
        <Input
          label="connect"
          onSubmit={(text: string) => {
            api.post('/auth/2fa/authenticate', { code: text });
          }}
        />
        <button
          onClick={() => {
            api
              .get('/auth/authenticated')
              .then(response => console.log(response.data))
              .catch(reject => console.log(reject));
          }}
        >
          user is authenticated
        </button>
      </div>
    </div>
  );
};

export default TwoAuth;

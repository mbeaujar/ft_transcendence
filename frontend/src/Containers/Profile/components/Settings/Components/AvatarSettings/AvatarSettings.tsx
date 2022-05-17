import React, { useEffect, useState } from 'react';
import api from '../../../../../../apis/api';
import Avatar from '../../../Avatar/Avatar';
import { toast } from 'react-toastify';
import './AvatarSettings.scss';
import { IUser } from '../../../../../../interface/user.interface';

interface Props {
  user: IUser;
  refresh: number;
  setRefresh: (value: number) => void;
}

function AvatarSettings(props: Props) {
  const [activeAvatarBottom, setActiveAvatarBottom] = useState<boolean>(true);
  const [selectedFileName, setSelectedFileName] =
    useState<string>('Choose a file...');
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [refresh, setRefresh] = useState<number>(0);
  const [refreshImg, setRefreshImg] = useState<number>(0);
  const [avatarImg, setAvatarImg] = useState<string>();

  useEffect(() => {
    props.setRefresh(props.refresh + 1);
    if (refreshImg === 0) {
      api
        .get(`/users/avatar/${props.user.avatarId}`, {
          responseType: 'blob',
        })
        .then((response) => setAvatarImg(URL.createObjectURL(response.data)))
        .catch((reject) => console.log(reject));
    }
    setRefreshImg(1);
  }, [refresh, uploadedFile]);

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  const changeAvatarImg = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setUploadedFile(event.currentTarget.files[0]);
      setAvatarImg(URL.createObjectURL(event.currentTarget.files[0]));
      setSelectedFileName(event.currentTarget.files[0].name);
    }
  };

  const validNewAvatar = () => {
    setSelectedFileName('Choose a file...');
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile, selectedFileName);
      api
        .post('/users/avatar/', formData)
        .then((response) => {
          setRefresh(refresh + 1);
          toast.success('Avatar succesfully change');
          setActiveAvatarBottom(!activeAvatarBottom);
        })
        .catch((reject) => {
          console.log(reject);
          toast.error('Incorrect file format');
        });
    }
    setUploadedFile(null);
  };

  const noValidNewAvatar = () => {
    setActiveAvatarBottom(!activeAvatarBottom);
    setSelectedFileName('Choose a file...');
    setUploadedFile(null);
    api
      .get(`/users/avatar/${props.user.avatarId}`, {
        responseType: 'blob',
      })
      .then((response) => setAvatarImg(URL.createObjectURL(response.data)))
      .catch((reject) => console.log(reject));
  };

  function showAvatarBottom() {
    if (activeAvatarBottom === true) return 'ShowAvatarBottom';
    else return 'HideAvatarBottom';
  }

  function showAvatarBottomInChange() {
    if (activeAvatarBottom === false) return 'ShowAvatarBottomInChange';
    else return 'HideAvatarBottomInChange';
  }

  return (
    <div className="Avatar">
      <h3>Avatar</h3>
      <div className={showAvatarBottom()}>
        <Avatar user={props.user} />
        <button onClick={() => setActiveAvatarBottom(!activeAvatarBottom)}>
          <span className="material-icons">edit</span>
        </button>
      </div>
      <div className={showAvatarBottomInChange()}>
        <div className="AvatarImg">
          <img src={avatarImg} />
        </div>
        <div className="AvatarBottomChange">
          <button className="buttonChooseFile" onClick={handleClick}>
            <span className="material-icons">backup</span>
            <p>{selectedFileName}</p>
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={changeAvatarImg}
            style={{ display: 'none' }}
          />
          <div className="ButtonsValidation">
            <button className="ValidNewAvatar" onClick={validNewAvatar}>
              <span className="material-icons">done</span>
            </button>
            <button className="NoValidNewAvatar" onClick={noValidNewAvatar}>
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarSettings;

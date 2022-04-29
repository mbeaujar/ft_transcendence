import React, { useState, useEffect } from "react";
import api from "../../../../../../apis/api";
import Dropdown from "../Dropdown/Dropdown.module";
import { toast } from "react-toastify";
import "./DoubleAuthSettings.scss";

function DoubleAuthSettings(props: any) {
  const [refresh, setRefresh] = useState<number>(0);
  const [valueEnableDoubleAuth, setValueEnableDoubleAuth] = useState(
    props.user.isTwoFactorEnabled ? "Yes" : "no"
  );
  const [qrcode, setQrcode] = useState<any>(null);
  const [twofaCode, setTwofaCode] = useState<string>("");
  const [inputPlaceholder, setInputPlaceholder] = useState<string>(
    "Enter the 6 digit code"
  );

  useEffect(() => {
    if (
      valueEnableDoubleAuth == "Yes" &&
      props.user.isTwoFactorEnabled == false
    ) {
      api
        .post("/auth/2fa/generate", {}, { responseType: "blob" })
        .then((response) => setQrcode(response.data))
        .catch((reject) => console.log(reject));
    }

    props.setRefresh(props.refresh + 1);
  }, [refresh, /*uploadedFile,*/ valueEnableDoubleAuth]);

  //Google authenticator
  const itemsGoogleAuth = [
    { id: 1, value: "Yes" },
    { id: 2, value: "No" },
  ];

  function dropdownIndex() {
    if (props.user.isTwoFactorEnabled == false) return 1;
    return 0;
  }

  function handleSubmitFormEnable2faInProgressCode(event: any) {
    api
      .post("/auth/2fa/enable", { code: twofaCode })
      .then((response) => {
        setTwofaCode("");
        toast.success("Google authenticator is now enable");
        props.user.isTwoFactorEnabled = true;
        setRefresh(refresh + 1);
      })
      .catch((reject) => {
        toast.error("Wrong code");
      });
  }

  function handleChangeEnable2faInProgressCode(event: any) {
    var value = event.target.value;
    setTwofaCode(value);
  }

  function handleSubmitFormDisable2faInProgressCode(event: any) {
    api
      .post("/auth/2fa/disable", { code: twofaCode })
      .then((response) => {
        setTwofaCode("");
        toast.success("Google authenticator is now disable");
        props.user.isTwoFactorEnabled = false;
        setRefresh(refresh + 1);
      })
      .catch((reject) => {
        toast.error("Wrong code");
      });
  }

  function handleChangeDisable2faInProgressCode(event: any) {
    if (twofaCode === "Wrong code!") {
      console.log(twofaCode);
      setTwofaCode("");
    }
    var value = event.target.value;
    setTwofaCode(value);
  }

  function showDoubleAuthBottom(className: string) {
    if (className == "DoubleAuthEnable2faInProgress") {
      if (
        valueEnableDoubleAuth == "Yes" &&
        props.user.isTwoFactorEnabled == false
      ) {
        return "showDoubleAuthEnable2faInProgress";
      }
      return "hideDoubleAuthEnable2faInProgress";
    } else if (className == "DoubleAuthDisable2faInProgress") {
      if (
        valueEnableDoubleAuth == "No" &&
        props.user.isTwoFactorEnabled == true
      ) {
        return "showDoubleAuthDisable2faInProgress";
      }
      return "hideDoubleAuthDisable2faInProgress";
    }
  }
  return (
    <div className="DoubleAuthSettings">
      <h3>Google Authenticator</h3>
      <div className="DoubleAuthMiddle">
        <Dropdown
          title="Enable google authenticator"
          items={itemsGoogleAuth}
          setValueEnableDoubleAuth={setValueEnableDoubleAuth}
          valueEnableDoubleAuth={valueEnableDoubleAuth}
          dropdownIndex={dropdownIndex()}
        />
      </div>
      <div className={showDoubleAuthBottom("DoubleAuthEnable2faInProgress")}>
        {qrcode ? <img src={URL.createObjectURL(qrcode)} /> : null}
        <div className="Right">
          <input
            className="NewName"
            type="text"
            value={twofaCode}
            onChange={(event) => handleChangeEnable2faInProgressCode(event)}
            placeholder={inputPlaceholder}
          />
          <button
            onClick={(event) => handleSubmitFormEnable2faInProgressCode(event)}
          >
            Enable
          </button>
        </div>
      </div>
      <div className={showDoubleAuthBottom("DoubleAuthDisable2faInProgress")}>
        <div className="Right">
          <input
            className="NewName"
            type="text"
            value={twofaCode}
            onChange={(event) => handleChangeDisable2faInProgressCode(event)}
            placeholder={inputPlaceholder}
          />
          <button
            onClick={(event) => handleSubmitFormDisable2faInProgressCode(event)}
          >
            Disable
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoubleAuthSettings;

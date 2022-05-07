import { useState, useEffect } from "react";

const getSize = () => {
  const ret = {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  };
  return ret;
};

const useWindowSize = () => {
  let [windowSize, setWindowSize] = useState(getSize());

  const handleResize = () => {
    setWindowSize(getSize());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;

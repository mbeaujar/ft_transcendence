import React, { useEffect, useState } from 'react';
import './Theme.scss';

export interface Props {
  theme:string;
  setTheme:(value: string) => void;
}

function Theme(props: Props) {
  useEffect(() => {}, []);
  const switchTheme = () => {
    const newTheme = props.theme === 'light' ? 'dark' : 'light';
    props.setTheme(newTheme);
  };
  return (
    <div className="Theme">
      <h3>Theme</h3>
            <button onClick={switchTheme}>
        Switch to {props.theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </div>
  );
}

export default Theme;

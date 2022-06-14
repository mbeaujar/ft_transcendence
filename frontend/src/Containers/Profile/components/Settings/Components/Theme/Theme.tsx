import clsx from 'clsx';
import React, { useEffect } from 'react';
import classes from './Theme.module.scss';

export interface Props {
  theme: string;
  setTheme: (value: string) => void;
}

function Theme(props: Props) {
  useEffect(() => {}, []);

  // function switchTheme (theme: string){
  //   props.setTheme(newTheme);
  // }

  function activeTheme(theme: string) {
    if (props.theme === theme) return classes.ActiveTheme;
    return classes.DisactiveTheme;
  }
  return (
    <div className={classes.Theme}>
      <h3>Theme</h3>
      <div className={classes.ThemeBottom}>
        <div
          className={clsx(
            classes.Buttontheme,
            classes.DarkTheme,
            activeTheme('dark'),
          )}
          onClick={() => props.setTheme('dark')}
        ></div>
        <div
          className={clsx(
            classes.Buttontheme,
            classes.LightTheme,
            activeTheme('light'),
          )}
          onClick={() => props.setTheme('light')}
        ></div>
        <div
          className={clsx(
            classes.Buttontheme,
            classes.BlueTheme,
            activeTheme('blue'),
          )}
          onClick={() => props.setTheme('blue')}
        ></div>
      </div>
      {/* <button onClick={switchTheme}>
        Switch to {props.theme === 'light' ? 'Dark' : 'Light'} Theme
      </button> */}
    </div>
  );
}

export default Theme;

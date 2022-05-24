// import React from "react";
import { useState, useEffect, useRef } from 'react';
import api from '../../../../apis/api';
import { IUser } from '../../../../interface/user.interface';
import classes from './Dropdown.module.scss';

interface Iitem {
  id: number;
  value: string;
}

interface Props {
  items: Iitem[];
  title: String;
  multiselect: boolean;
  WIDTH: number;
  HEIGHT: number;
  id: string;
  hideButton: boolean;
  setState: (value: number) => void;
  index: number;
  blockDropdown: number;
  paramRouteMode?: number;
  paramRouteOpponent: string;
}

function Dropdown(props: Props) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string>(
    props.items[props.index].value,
  );
  const close = () => {
    if (props.blockDropdown === 0) setOpen(!open);
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBodyClick = (event: any) => {
      if (ref.current) if (ref.current.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener('click', onBodyClick, { capture: true });

    if (props.id == 'GameMode') {
      if (props.paramRouteMode === -1) setSelection(props.items[0].value);
      if (props.paramRouteMode && props.paramRouteMode !== -1) {
        setSelection(props.items[props.paramRouteMode].value);
        props.setState(props.items[props.paramRouteMode].id);
      }
    } else if (props.id == 'PaddleSpeed')
      setSelection(props.items[props.index].value);
    else if (props.id == 'Opponent') {
      if (props.paramRouteOpponent !== '')
        setSelection(props.paramRouteOpponent);
    }

    return () => {
      document.removeEventListener('click', onBodyClick, { capture: true });
    };
  }, []);

  function handleOnClick(item: Iitem, multiSelect: boolean) {
    setSelection(item.value);
    props.setState(item.id);
  }

  function setPosition() {
    // if (props.id == 1) return props.WIDTH * -0.6;
    // else if (props.id == 2) return props.WIDTH*0;
    // else if (props.id == 3) return props.WIDTH*0.6;
    if (props.id == 'GameMode') return props.WIDTH * 0.05;
    else if (props.id == 'PaddleSpeed') return props.WIDTH * 0.36;
    else if (props.id == 'Opponent') return props.WIDTH * 0.67;
  }

  function isItemInSelection(item: Iitem) {
    if (selection === item.value) {
      return <span className="material-icons">done</span>;
    }
    return false;
  }

  function ftShowDropdown() {
    if (props.hideButton === false) return classes.Dropdown;
    return classes.HideDropdown;
  }

  return (
    <div
      className={ftShowDropdown()}
      ref={ref}
      style={{ top: props.HEIGHT / 3.2, marginLeft: setPosition() }}
    >
      <div
        tabIndex={0}
        className={classes.header}
        role="button"
        onKeyPress={() => close()}
        onClick={() => close()}
      >
        <div className={classes.headerTitle}>
          <p className={classes.headerTitleP}>{props.title}</p>
        </div>
        <div className={classes.headerChoice}>
          <p>{selection}</p>
        </div>
      </div>
      {open && (
        <ul className={classes.list} onClick={() => close()}>
          {props.items.map((item: Iitem) => (
            <li className={classes.dd_list_item} key={item.id}>
              <button
                type="button"
                onClick={() => handleOnClick(item, props.multiselect)}
              >
                <p>{item.value}</p>
                <span className={classes.checkLogo}>
                  {isItemInSelection(item)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;

import React from "react";
import { useState, useEffect, useRef } from "react";
import classes from "./Dropdown2.module.scss";

function Dropdown(props: any) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string>(
    props.items[props.channelState].value
  );
  const close = () => setOpen(!open);
  const ref = useRef<any>();

  useEffect(() => {
    setSelection(props.items[props.channelState].value);
    const onBodyClick = (event: any) => {
      if (ref.current.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("click", onBodyClick, { capture: true });
    return () => {
      document.removeEventListener("click", onBodyClick, { capture: true });
    };
  }, [props.refreshDropdown]);

  function handleOnClick(item: any, multiSelect: boolean) {
    if (selection != item.value) {
      setSelection(item.value);
      props.setNewChallengeMode(item.value);
    } else {
      setSelection(props.items[props.channelState].value);
      props.setNewChallengeMode(props.items[props.channelState].value);
    }
  }

  function isItemInSelection(item: any) {
    if (selection === item.value) {
      return <span className="material-icons">done</span>;
    }
    return false;
  }

  return (
    <div className={classes.Dropdown} ref={ref}>
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
          {props.items.map((item: any) => (
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
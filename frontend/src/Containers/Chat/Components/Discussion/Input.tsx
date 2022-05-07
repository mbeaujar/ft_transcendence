import React, { useState } from 'react';
import classes from './Input.module.scss';

interface Props {
  label?: string;
  onSubmit?: any;
}

const Input: React.FC<Props> = (props: Props): JSX.Element => {
  const [text, setText] = useState<string>('');

  return (
    <div className={classes.Input}>
      <form
        onSubmit={e => {
          e.preventDefault();
          props?.onSubmit(text);
          setText('');
        }}
      >
        <label>{props?.label} </label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Input;

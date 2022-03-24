import React, { useState } from 'react';

interface Props {
  className?: any;
  label?: string;
  onSubmit?: any;
}

const Input: React.FC<Props> = (props: Props): JSX.Element => {
  const [text, setText] = useState<string>('');

  return (
    <div className={props.className}>
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

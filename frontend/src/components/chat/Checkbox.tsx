import React, { useEffect } from 'react';

interface Props {
  label: string;
  value: boolean;
  onChange: any;
}

const Checkbox: React.FC<Props> = (props: Props): JSX.Element => {
  return (
    <div>
      <label>{props.label}</label>
      <input type="checkbox" checked={props.value} onChange={props.onChange} />
    </div>
  );
};

export default Checkbox;

import React from 'react';
import classes from './Layout.module.scss';

type Props = 
{ 
    children: React.ReactNode;
};

const Layout: React.FC<Props> = ({children}) => {
  return (
    <div className={classes.Layout}>
        <h1>Ok</h1>
        {children}
    </div>
  );
}

export default Layout;



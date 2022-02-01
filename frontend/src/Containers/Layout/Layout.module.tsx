import React from 'react';
import classes from './Layout.module.scss';
import Header from '../Header/Header.module'

type Props = 
{ 
    children: React.ReactNode;
};

const Layout: React.FC<Props> = ({children}) => {
  return (
    <div className={classes.Layout}>
        <Header/>
        {children}
    </div>
  );
}

export default Layout;



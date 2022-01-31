import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Route, Switch } from 'react-router';

import Layout from './Containers/Layout/Layout.module';

function App() {
  return (
    <div className="App">
      <Layout>
        <Switch>
          {/*<Route exact path="/Mercury" component={Mercury}/>
          <Route exact path="/Venus" component={Venus}/>
          <Route exact path="/" component={Earth}/>
          <Route exact path="/Mars" component={Mars}/>
          <Route exact path="/Jupiter" component={Jupiter}/>
          <Route exact path="/Saturn" component={Saturn}/>
          <Route exact path="/Uranus" component={Uranus}/>
  <Route exact path="/Neptune" component={Neptune}/>*/}
        </Switch>
      </Layout>
    </div>
  );
}

export default App;

import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";

import loadable from "@loadable/component";
const HomeComponent = loadable(() => import("./Home"));

const App = () => (
  <Switch>
    <Route exact path="/" component={HomeComponent} />
  </Switch>
);

export default App;

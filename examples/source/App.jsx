import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Index from "./Index";
import OrderableList from "./examples/OrderableList";
import PositionableItem from "./examples/PositionableItem";

import "./styles/main.css";

export default () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/orderable" component={OrderableList} />
            <Route path="/positionable" component={PositionableItem} />
        </Switch>
    </HashRouter>
);

/*
    Examples TODO:
        - Promise submenu
        - Icons
        - Custom properties/data
*/

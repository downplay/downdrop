import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Index from "./Index";
import OrderableList from "./examples/OrderableList";
import OrderableListWithPortal from "./examples/OrderableListWithPortal";
import PositionableItem from "./examples/PositionableItem";
import "./styles/main.css";

export default () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/orderable" component={OrderableList} />
            <Route
                path="/orderable-portal"
                component={OrderableListWithPortal}
            />
            <Route path="/positionable" component={PositionableItem} />
        </Switch>
    </HashRouter>
);

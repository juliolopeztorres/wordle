import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import RouteService from "./Service/RouteService";

ReactDOM.render(
    <BrowserRouter>
        <RouteService/>
    </BrowserRouter>,
    document.getElementById('app')
);

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import RouteService from "./Service/RouteService";

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <RouteService/>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('app')
);

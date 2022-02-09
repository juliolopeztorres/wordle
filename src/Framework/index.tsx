import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RouteService from "./Service/RouteService";
import './style.sass';

const myTheme = createTheme({
    palette: {
      primary: {
        main: '#000',
      },
    },
  });

ReactDOM.render(
    <ThemeProvider theme={myTheme}>
        <BrowserRouter>
            <RouteService/>
        </BrowserRouter>
    </ThemeProvider>,
    document.getElementById('app')
);

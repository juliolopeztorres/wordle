import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DefaultView from '../View/DefaultView';
import ServiceContainer from '../DependencyInjection/ServiceContainer';
import ServiceContainerInterface from '../DependencyInjection/ServiceContainerInterface';

type routes = 'home';

const serviceContainer: ServiceContainerInterface = new ServiceContainer();

export default function RouteService() {
  return (
    <Switch>
      <Route exact path={getRoute('home')}>
        <DefaultView/>
      </Route>
      <h1>404 - Route not found</h1>
    </Switch>
  );
}

export function getRoute(path: routes): string {
  // generatePath('/'), // generatePath(path, parameters) -> Path string and parameters an object
  const routes = {
    home: {
      route: "/",
    },
  };

  return routes[path].route;
}

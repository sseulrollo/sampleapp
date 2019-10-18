import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import createRootReducer from './reducer'
import * as Authentication from './store/Authentication'
import * as Spcall from './store/Spcall'
import thunk from 'redux-thunk';

export const history = createBrowserHistory()

export default function configureStore(preloadedState) {

  const reducers = {
    spCall: Spcall.reducer,
    login: Authentication.reducer
  };

  const middleware = [
    thunk,
    routerMiddleware(history),
  ]
  
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  
  const store = createStore(
    combineReducers({
      ...reducers,
      router: connectRouter(history)
    }),
    preloadedState,
    composeEnhancer(
      applyMiddleware(...middleware)
    )
  )

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store
}





// import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
// import thunk from 'redux-thunk';
// import { routerReducer, routerMiddleware } from 'react-router-redux';
// import * as Counter from './Counter';
// import * as WeatherForecasts from './WeatherForecasts';

// export default function configureStore (history, initialState) {
//   const reducers = {
//     counter: Counter.reducer,
//     weatherForecasts: WeatherForecasts.reducer
//   };

//   const middleware = [
//     thunk,
//     routerMiddleware(history)
//   ];

//   // In development, use the browser's Redux dev tools extension if installed
//   const enhancers = [];
//   const isDevelopment = process.env.NODE_ENV === 'development';
//   if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
//     enhancers.push(window.devToolsExtension());
//   }

//   const rootReducer = combineReducers({
//     ...reducers,
//     routing: routerReducer
//   });

//   return createStore(
//     rootReducer,
//     initialState,
//     compose(applyMiddleware(...middleware), ...enhancers)
//   );
// }

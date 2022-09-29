// configureStore sustituye a createStore
import { applyMiddleware } from "@reduxjs/toolkit";
import { legacy_createStore as createStore } from "redux";
//Para poder trabajar con el plugIn de Chrome:
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducers";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

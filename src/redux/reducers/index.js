import { combineReducers } from "@reduxjs/toolkit";
import Auth from "./auth";
import Alert from "./alert";
//Es muy importante poner aqui los reducers para poder usarlos en otros lugares
export default combineReducers({
  Auth,
  Alert,
});

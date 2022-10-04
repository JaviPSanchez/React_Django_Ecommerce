import { combineReducers } from "@reduxjs/toolkit";
import Auth from "./auth";

//Es muy importante poner aqui los reducers para poder usarlos en otros lugares
export default combineReducers({
  Auth,
});

import { combineReducers } from "@reduxjs/toolkit";
import Auth from "./auth";
import Alert from "./alert";
import Categories from "./categories";
import Products from "./products";
import Cart from "./cart";
import Shipping from "./shipping";

//Es muy importante poner aqui los reducers para poder usarlos en otros lugares
// Toda la informacion estará disponible en el Front:
export default combineReducers({
  Auth,
  Alert,
  Categories,
  Products,
  Cart,
  Shipping,
});

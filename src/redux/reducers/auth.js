import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  REFRESH_SUCCESS,
  REFRESH_FAIL,
  LOGOUT,
} from "../actions/types";

// Definimos el estado inicial de redux:

const initialState = {
  // Queremos guardar como variables el token de acceso y de refresco:
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: null,
  user: null,
  loading: false,
};

export default function Auth(state = initialState, action) {
  //llamamos a nuestra variables de tipo y payload y las vinculamos a la accion
  const { type, payload } = action;

  switch (type) {
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_AUTH_LOADING:
      return {
        ...state,
        loading: false,
      };
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case AUTHENTICATED_FAIL:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return {
        ...state,
        isAuthenticated: false,
        access: null,
        refresh: null,
      };
    case LOGIN_SUCCESS:
      //tenemos acceso a la payload, que continen access y refresh
      localStorage.setItem("access", payload.access);
      localStorage.setItem("refresh", payload.access);
      return {
        ...state,
        //ya nos hemos autentificado posteriormente
        isAuthenticated: true,
        access: localStorage.getItem("access"),
        refresh: localStorage.getItem("refresh"),
      };
    case ACTIVATION_SUCCESS:
    case ACTIVATION_FAIL:
      return {
        ...state,
      };

    case REFRESH_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        access: localStorage.getItem("access"),
      };
    case SIGNUP_SUCCESS:
    case LOGIN_FAIL:
    case SIGNUP_FAIL:
    case REFRESH_FAIL:
    case LOGOUT:
      // como ya hemos hecho el registro hay que borrar las variables:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    // Si no returnamos el default el switch statement da error:
    default:
      return state;
  }
}

import { SIGNUP_SUCCESS, SIGNUP_FAIL } from "../actions/types";

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
    case SIGNUP_SUCCESS:
    case SIGNUP_FAIL:
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

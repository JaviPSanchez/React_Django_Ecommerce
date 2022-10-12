import { SET_ALERT, REMOVE_ALERT } from "./types";

//funcion que usaremos para crear nuestras alertas:
export const setAlert =
  //msg --> el mensaje de la alerta puede variar
  // alertType --> el tipo de alerta puede ser verde o rojo
  // el timeout diremos que es inicialmente de 5 segundos


    (msg, alertType, timeout = 5000) =>
    (dispatch) => {
      dispatch({
        type: SET_ALERT,
        payload: { msg, alertType },
      });
      // la funcion setTimeout es propia de react, que pasados un tiempo hace que ocurra algo, en este caso pasados los 5 segundos que la funcion se lance
      setTimeout(() => dispatch({ type: REMOVE_ALERT }), timeout);
    };

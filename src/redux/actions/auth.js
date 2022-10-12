import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
} from "./types";
import { setAlert } from "./alert";
import Axios from "axios";
// import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";

// creamos nuestra funcion de sign up con los parametros, todo sera asyncrono puesto esperamos una respuesta:

//Como estamos usando eventos, le pasaremos un dispatch

export const signup =
  (first_name, last_name, email, password, re_password) => async (dispatch) => {
    //Para cuando estamos cargando
    dispatch({
      type: SET_AUTH_LOADING,
    });

    // Cuando hacemos un envio lo primero que hacemos es un Content-type en el Headers:

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Luego configuraremos el body con JSON.stringify que convierte un OBJECT en JSON:

    /*
    const Dog = {
        name:'foo',
        age: 7
    }
    console.log(Dog) // {name: 'foo', age: 7}

    let DogString = Json.stringify(Dog)

    console.log(DocString) // {"name": "foo", "age": 7}
    
    */

    const body = JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      re_password,
    });

    // Luego hacemos la llamada con el API:

    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/auth/users/`,
        body,
        config
      );

      //Siempre hay una respuesta despues del post, la cual esta guardada en response:

      if (response.status === 201) {
        // Lo enviamos a nuestro reductor:
        dispatch({
          type: SIGNUP_SUCCESS,
          payload: response.data,
        });
        dispatch(
          setAlert(
            "Te hemos enviado un correo, por favor activa tu cuenta. Revisa la carpeta de spam",
            "green"
          )
        );
      } else {
        dispatch({
          type: SIGNUP_FAIL,
          // En caso de que falle , ya no hay payload...
        });
        dispatch(setAlert("Error al crear cuenta", "red"));
      }
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
    } catch (error) {
      dispatch({
        type: SIGNUP_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      dispatch(
        setAlert("Error al conectar con el servidor, intentar mas tarde", "red")
      );
    }
  };

export const activate = (uid, token) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({
    uid,
    token,
  });
  try {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/activation/`,
      body,
      config
    );
    //Segun Djoser la respuesta es 204
    if (response.status === 204) {
      dispatch({
        type: ACTIVATION_SUCCESS,
      });
      dispatch(setAlert("Cuenta activada correctamente", "green"));
    } else {
      dispatch({
        type: ACTIVATION_FAIL,
      });
      dispatch(setAlert("Error activando cuenta", "red"));
    }
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
  } catch (error) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
    dispatch(
      setAlert("Error al conectar con el servidor, intentar mas tarde", "red")
    );
  }
};

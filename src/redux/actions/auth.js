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
} from "./types";
import { setAlert } from "./alert";
import Axios from "axios";
// import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";

//funcion para comprobar que estamos autentificados: http://localhost:8000/auth/jwt/verify
export const check_authenticated = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //hacemos un body con el token, que lo sacamos de localStorage
    const body = JSON.stringify({
      token: localStorage.getItem("access"),
    });

    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/verify/`,
        body,
        config
      );
      //Aqui no pasamos ningun tipo de payload porque es solo para verificar
      if (response.status === 200) {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};
//http://localhost:8000/auth/users/
export const signup =
  // creamos nuestra funcion de sign up con los parametros, todo sera asyncrono puesto esperamos una respuesta:
  //Como estamos usando eventos, le pasaremos un dispatch
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

//funcion para cargar al user, seria el metodo GET http://localhost:8000/auth/users/me/ de ver la info del user
export const load_user = () => async (dispatch) => {
  //Si existe un access en nuestro local storage:
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        //Creamos un nuevo header:
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      //solo hacemos GET y no necesitamos el body puesto que no es un POST
      const response = await Axios.get(
        `${process.env.REACT_APP_API_URL}/auth/users/me/`,
        config
      );

      if (response.status === 200) {
        dispatch({
          type: USER_LOADED_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: USER_LOADED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};
//http://localhost:8000/auth/jwt/create
export const login = (email, password) => async (dispatch) => {
  dispatch({
    type: SET_AUTH_LOADING,
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    email,
    password,
  });

  try {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_URL}/auth/jwt/create/`,
      body,
      config
    );

    if (response.status === 200) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      });
      //Si estamos correctamente login, llamamos a la funcion de load_user
      dispatch(load_user());
      //Ya hemos hecho el login, quitamos el loading
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      dispatch(
        setAlert("Inicio de sesión con éxito!", "bg-green-50 text-green-800")
      );
    } else {
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: REMOVE_AUTH_LOADING,
      });
      dispatch(
        setAlert(
          "Error al iniciar sesion! Los siento amigo",
          "bg-red-50 text-red-800"
        )
      );
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch({
      type: REMOVE_AUTH_LOADING,
    });
    dispatch(
      setAlert(
        "Error al iniciar sesion! Intenta mas tarde",
        "bg-red-200 text-red-800"
      )
    );
  }
};
//http://localhost:8000/auth/users/activation/
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
//Con esta funcion refrescamos al usuario y verificamos que esta autentificado --> http://localhost:8000/auth/jwt/refresh
export const refresh = () => async (dispatch) => {
  if (localStorage.getItem("refresh")) {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      refresh: localStorage.getItem("refresh"),
    });

    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`,
        body,
        config
      );

      if (response.status === 200) {
        dispatch({
          type: REFRESH_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: REFRESH_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: REFRESH_FAIL,
      });
    }
  } else {
    dispatch({
      type: REFRESH_FAIL,
    });
  }
};
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch(setAlert("Succesfully logged out", "green"));
};

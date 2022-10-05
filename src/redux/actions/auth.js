import { SIGNUP_SUCCESS, SIGNUP_FAIL } from "./types";
// import { setAlert } from "./alert";
import Axios from "axios";
// import { getMouseEventOptions } from "@testing-library/user-event/dist/utils";

// creamos nuestra funcion de sign up con los parametros, todo sera asyncrono puesto esperamos una respuesta:

//Como estamos usando eventos, le pasaremos un dispatch

const signup =
  (email, first_name, last_name, password, repeat_password) =>
  async (dispatch) => {
    // dispatch({
    //   type: SET_AUTH_LOADING,
    // });

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
      repeat_password,
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
        // En caso de que falle , ya no hay payload...
      } else {
        dispatch({
          type: SIGNUP_FAIL,
        });
        // dispatch(setAlert("Error al crear cuenta", "red"));
      }
    } catch (error) {
      dispatch({
        type: SIGNUP_FAIL,
      });
    }
  };

export default signup;

import Axios from "axios";
import { GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL } from "./types";

export const get_categories = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  try {
    const response = await Axios.get(
      `${process.env.REACT_APP_API_URL}/api/category/categories`,
      config
    );

    if (response.status === 200) {
      dispatch({
        type: GET_CATEGORIES_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: GET_CATEGORIES_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: GET_CATEGORIES_FAIL,
    });
  }
};

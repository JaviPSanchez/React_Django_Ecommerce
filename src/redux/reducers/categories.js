import { GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL } from "../actions/types";

const initialState = {
  categories: null,
};

export default function Categories(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        //Aqui el categories viene de -->  return Response({'categories': result} en views/category
        categories: payload.categories,
      };
    case GET_CATEGORIES_FAIL:
      return {
        ...state,
        categories: null,
      };
    default:
      return state;
  }
}

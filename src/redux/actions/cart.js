import Axios from "axios";
import {
  ADD_ITEM,
  GET_TOTAL,
  GET_ITEM_TOTAL,
  GET_ITEMS,
  UPDATE_ITEM,
  REMOVE_ITEM,
  EMPTY_CART,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAIL,
  GET_TOTAL_SUCCESS,
  GET_TOTAL_FAIL,
  GET_ITEM_TOTAL_SUCCESS,
  GET_ITEM_TOTAL_FAIL,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAIL,
  UPDATE_ITEM_SUCCESS,
  UPDATE_ITEM_FAIL,
  REMOVE_ITEM_SUCCESS,
  REMOVE_ITEM_FAIL,
  EMPTY_CART_SUCCESS,
  EMPTY_CART_FAIL,
  SYNCH_CART_SUCCESS,
  SYNCH_CART_FAIL,
} from "./types";

// Agragar un item al carrito.
export const add_item = (product) => async (dispatch) => {
  // Primero verificamos si la persona esta loggeada.
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };
    // Para agregar un producto necesitamos su id:
    const product_id = product.id;
    const body = JSON.stringify({ product_id });
    // http://localhost:8000/api/cart/add-item
    try {
      const res = await Axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add-item`,
        body,
        config
      );

      if (res.status === 201) {
        dispatch({
          type: ADD_ITEM_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: ADD_ITEM_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: ADD_ITEM_FAIL,
      });
    }
    // Si no estamos con localstorage:
  } else {
    // Declaramos un carrito vacio
    let cart = [];
    // Intentamos llamar al carrito en caso de que exista
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    // Funcion para agregar un item
    let shouldAddItem = true;

    cart.map((item) => {
      // verificamos si el id del producto existe
      if (product.id.toString() === item.product.id.toString()) {
        shouldAddItem = false;
      }
    });

    const order_item = {
      product: product,
      count: 1,
    };

    if (shouldAddItem) {
      cart.push(order_item);
    }

    dispatch({
      type: ADD_ITEM,
      payload: cart,
    });
  }
};
// Obtener items:
export const get_items = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart/cart-items`,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: GET_ITEMS_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_ITEMS_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: GET_ITEMS_FAIL,
      });
    }
  } else {
    dispatch({
      type: GET_ITEMS,
    });
  }
};
// Obtener total
export const get_total = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart/get-total`,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: GET_TOTAL_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_TOTAL_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: GET_TOTAL_FAIL,
      });
    }
    // Aqui tambien tenemos la opcion de agregar el carrito si no somos usuarios:
  } else {
    // Declaramos el carrito y que esta vacio.
    let total = 0.0;
    let compare_total = 0.0;
    let cart = [];
    // Una vez en el localstorage, agregamos carrito
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));

      cart.map((item) => {
        total += parseFloat(item.product.price) * parseFloat(item.count);
        compare_total +=
          parseFloat(item.product.compare_price) * parseFloat(item.count);
      });
    }

    dispatch({
      type: GET_TOTAL,
      payload: [
        parseFloat(total.toFixed(2)),
        parseFloat(compare_total.toFixed(2)),
      ],
    });
  }
};
// Total de un item:
export const get_item_total = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await Axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart/get-item-total`,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: GET_ITEM_TOTAL_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_ITEM_TOTAL_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: GET_ITEM_TOTAL_FAIL,
      });
    }
  } else {
    let total = 0;
    // Agarramos el total
    if (localStorage.getItem("cart")) {
      total = JSON.parse(localStorage.getItem("cart")).length;
    }

    dispatch({
      type: GET_ITEM_TOTAL,
      payload: total,
    });
  }
};
// Que item queremos actualizar y cuantos
export const update_item = (item, count) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const product_id = item.product.id;
    const body = JSON.stringify({ product_id, count });

    try {
      const res = await Axios.put(
        `${process.env.REACT_APP_API_URL}/api/cart/update-item`,
        body,
        config
      );

      if (res.status === 200 && !res.data.error) {
        dispatch({
          type: UPDATE_ITEM_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: UPDATE_ITEM_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: UPDATE_ITEM_FAIL,
      });
    }
    // Si queremos actualizar el carrito y no existe
  } else {
    let cart = [];

    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));

      cart.map((cart_item, index) => {
        if (cart_item.product.id.toString() === item.product.id.toString()) {
          cart[index].count = parseInt(count);
        }
      });
    }

    dispatch({
      type: UPDATE_ITEM,
      payload: cart,
    });
  }
};
// quitar un elemento
export const remove_item = (item) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const product_id = item.product.id;
    const body = JSON.stringify({ product_id });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
      data: body,
    };

    try {
      const res = await Axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/remove-item`,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: REMOVE_ITEM_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: REMOVE_ITEM_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: REMOVE_ITEM_FAIL,
      });
    }
  } else {
    let cart = [];
    let new_cart = [];

    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));

      cart.map((cart_item) => {
        if (cart_item.product.id.toString() !== item.product.id.toString()) {
          new_cart.push(cart_item);
        }
      });
    }

    dispatch({
      type: REMOVE_ITEM,
      payload: new_cart,
    });
  }
};

export const empty_cart = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await Axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/empty-cart`,
        config
      );

      if (res.status === 200) {
        dispatch({
          type: EMPTY_CART_SUCCESS,
        });
      } else {
        dispatch({
          type: EMPTY_CART_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: EMPTY_CART_FAIL,
      });
    }
  } else {
    dispatch({
      type: EMPTY_CART,
    });
  }
};

export const synch_cart = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
  };

  let cart_items = [];

  if (localStorage.getItem("cart")) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    // No usamos map porque no queremos devolver nada, luego usamos forEach
    cart.forEach((cart_item) => {
      const item = {};
      item.product_id = cart_item.product.id;
      item.count = cart_item.count;
      cart_items.push(item);
    });
  }

  const body = JSON.stringify({ cart_items });

  try {
    const res = await Axios.put(
      `${process.env.REACT_APP_API_URL}/api/cart/synch`,
      body,
      config
    );

    if (res.status === 201) {
      dispatch({
        type: SYNCH_CART_SUCCESS,
      });
    } else {
      dispatch({
        type: SYNCH_CART_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: SYNCH_CART_FAIL,
    });
  }
};

// Vamos a trabajar con toastify, que es muy bueno para las notificaciones de nuestra app
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

import { check_authenticated, load_user, refresh } from "../redux/actions/auth";
// Cargamos el info de nuestro carrito
import { get_items, get_total, get_item_total } from "../redux/actions/cart";
import { useEffect } from "react";
import { connect } from "react-redux";
//Mostramos el Navbar y el Footer y en medio la info que pasemos las paginas de los contenedores
const Layout = (props) => {
  useEffect(() => {
    props.refresh();
    props.check_authenticated();
    props.load_user();
    props.get_items();
    props.get_total();
    props.get_item_total();
    // props.get_user_profile();
  }, []);
  return (
    <div>
      <Navbar />
      {/* <ToastContainer autoClose={5000} /> */}
      <ToastContainer />
      {props.children}
      <Footer />
    </div>
  );
};

export default connect(null, {
  check_authenticated,
  load_user,
  refresh,
  get_items,
  get_total,
  get_item_total,
  // get_user_profile
})(Layout);

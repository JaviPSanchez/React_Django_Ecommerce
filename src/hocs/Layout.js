// Vamos a trabajar con toastify, que es muy bueno para las notificaciones de nuestra app
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

//Mostramos el Navbar y el Footer y en medio la info que pasemos las paginas de los contenedores
const Layout = (props) => {
  return (
    <div>
      <Navbar />
      <ToastContainer autoClose={5000} />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;

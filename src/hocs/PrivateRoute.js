import { Outlet, Navigate } from "react-router-dom";
import { connect } from "react-redux";

// El objetivo es que solo los usuarios autenticados puedan acceder

const PrivateRoute = ({ auth: { isAuthenticated, loading } }) => {
  //   let auth = { isAuthenticated: isAuthenticated, loading: loading };
  // Creamos nuestra propia ruta
  return !isAuthenticated && !loading ? <Navigate to="/login" /> : <Outlet />;
};

const mapStateToProps = (state) => ({
  // De aqui cogeremos isAuthenticated y loading
  auth: state.Auth,
});

export default connect(mapStateToProps, {})(PrivateRoute);

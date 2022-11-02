import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import Error404 from "./containers/errors/Error404";

import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login";
import Activate from "./containers/auth/Activate";
import ResetPassword from "./containers/auth/ResetPassword";
import ResetPasswordConfirm from "./containers/auth/ResetPasswordConfirm";

import Shop from "./containers/Shop";
import ProductDetail from "./containers/pages/productDetail";
import Search from "./containers/pages/Search";
import Cart from "./containers/pages/Cart";
import Checkout from "./containers/pages/Checkout";
import PrivateRoute from "./hocs/PrivateRoute";
// import ThankYou from './containers/pages/ThankYou';
// import Dashboard from './containers/pages/Dashboard';
// import DashboardPayments from './containers/pages/DashboardPayments';
// import DashboardPaymentDetail from './containers/pages/DashboardPaymentDetail';
// import DashboardProfile from './containers/pages/DashboardProfile';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Error404 />} />

          <Route exact path="/" element={<Home />} />
          <Route exact path="/cart" element={<Cart />} />
          {/* <Route element={<PrivateRoute />}>
            <Route exact path="/checkout" element={<Checkout />} />
          </Route> */}
          <Route exact path="/checkout" element={<Checkout />} />

          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/activate/:uid/:token" element={<Activate />} />
          <Route exact path="/reset_password" element={<ResetPassword />} />
          {/* Aplicamos misma logica que en Djoser --> core/settings de Django */}
          <Route
            exact
            path="/password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm />}
          />

          <Route exact path="/shop" element={<Shop />} />
          <Route exact path="/product/:productId" element={<ProductDetail />} />
          <Route exact path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import Error404 from "./containers/errors/Error404";

import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login";
import Activate from "./containers/auth/Activate";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Error404 />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/activate/:uid/:token" element={<Activate />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

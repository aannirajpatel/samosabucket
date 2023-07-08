import React, { useState, useEffect } from "react";
import "../node_modules/bulma/css/bulma.min.css";
import "./";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import axios from "axios";
import Navbar from "./Navbar";
import Home from "./Home";
import Cart from "./Cart";
import Login from "./Login";
import Orders from "./Orders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./Signup";
import Me from "./Me";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import Info from "./Info";
function App() {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loginHandler = () => {
    axios
      .get(window.env.REACT_APP_BACKEND_API + "/user/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        if (isLoggedIn === false) {
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        setIsLoggedIn(true);
        if (res.data.isAdmin === "true" || res.data.isAdmin === true) {
          if (isAdmin === false || isAdmin === "false") {
            toast.success("Welcome, admin!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          setIsAdmin(true);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
        setUser({});
      });
  };
  useEffect(() => {
    loginHandler();
    toast.success(
      "Note: by using this website, you agree to our Cookie policy",
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
    return () => { };
  }, []);
  const logoutHandler = () => {
    setUser({ name: "", isAdmin: false, cart: [] });
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Navbar
        user={user}
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        logoutHandler={logoutHandler}
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AnimatedSwitch
        atEnter={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        className="switch-wrapper"
      >
        <Route path="/me">
          <Me loginHandler={loginHandler} />
        </Route>
        <Route path="/orders">
          <Orders loginHandler={loginHandler} />
        </Route>
        <Route path="/info">
          <Info />
        </Route>
        <Route path="/adminorders">
          <AdminOrders loginHandler={loginHandler} />
        </Route>
        <Route path="/adminproducts">
          <AdminProducts loginHandler={loginHandler} />
        </Route>
        <Route path="/cart">
          <Cart refreshCart={loginHandler} />
        </Route>
        <Route path="/login">
          <Login loginHandler={loginHandler} redirectTo="/" />
        </Route>
        <Route path="/signup">
          <Signup loginHandler={loginHandler} redirectTo="/" />
        </Route>
        <Route path="/">
          <Home refreshCart={loginHandler} />
        </Route>
      </AnimatedSwitch>
    </Router>
  );
}

export default App;

import Axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var FA = require("react-fontawesome");

function Navbar({ isAdmin, isLoggedIn, user, logoutHandler }) {
  const [isHBActive, setIsHBActive] = useState(false);
  const handleLogout = () => {
    Axios.get(window.env.REACT_APP_BACKEND_API + "/user/logout", {
      withCredentials: true,
    })
      .then((res) => {
        toast.warn("You have been logged out.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        logoutHandler();
      })
      .catch((e) =>
        toast.warn("Error logging out. Try clearing cookies.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  };

  const toggleMenu = () => {
    setIsHBActive(!isHBActive);
  };

  return (
    <nav
      className="navbar box p-1"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={logo} width="112" height="28" alt="Samosabucket Logo" />
        </Link>

        <span
          role="button"
          className={"navbar-burger burger" + (isHBActive ? " is-active" : "")}
          aria-label="menu"
          aria-expanded="false"
          data-target="navTarget"
          onClick={toggleMenu}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </span>
      </div>

      <div
        id="navTarget"
        className={"navbar-menu" + (isHBActive ? " is-active" : "")}
      >
        <div className="navbar-start">
          <Link className="navbar-item button is-light mx-2 mt-2" to="/">
            <FA name="shopping-bag" />
            &nbsp;Shop
          </Link>
          <Link className="navbar-item button is-light mx-2 mt-2" to="/cart">
            <FA name="shopping-cart" />
            &nbsp;Cart
            {isLoggedIn && user.cart.length > 0 && (
              <span class="badge">{user.cart.length}</span>
            )}
          </Link>
          <Link className="navbar-item button is-light mx-2 mt-2" to="/orders">
            <FA name="credit-card" />
            &nbsp;Orders
          </Link>
          <Link className="navbar-item button is-light mx-2 mt-2" to="/info">
            <FA name="info" />
            &nbsp;{window.env.REACT_APP_INFO_TAB_NAME || "Info"}
          </Link>

          {isAdmin && (
            <Link
              className="navbar-item button is-light mx-2 mt-2"
              to="/adminorders"
            >
              <FA name="gear" />
              &nbsp;Manage Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              className="navbar-item button is-light mx-2 mt-2"
              to="/adminproducts"
            >
              <FA name="gear" />
              &nbsp; Products
            </Link>
          )}
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!isLoggedIn ? (
                <>
                  <Link className="button is-primary" to="/signup">
                    <strong>Sign up</strong>
                  </Link>
                  <Link className="button is-light" to="/login">
                    Log in
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/me" className="button is-light">
                    <FA name="user" />
                    &nbsp;Profile
                  </Link>
                  <Link
                    to="/"
                    className="button is-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
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
    </nav>
  );
}

export default Navbar;

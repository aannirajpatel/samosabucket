import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Order from "./Order";
import Login from "./Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Orders({ loginHandler }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const refreshOrders = (str) => {
    Axios.get(window.env.REACT_APP_BACKEND_API + "/order/", {
      withCredentials: true,
    })
      .then((res) => {
        setOrders(res.data);
        if (str) {
          toast.success(str, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            setIsLoggedIn(false);
            setError("Please log in first.");
          } else
            setError(err.response.status + " " + err.response.data.message);
        }
      });
  };
  useEffect(() => {
    if (error != "")
      toast.error("Error: " + error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  }, [error]);

  useEffect(() => {
    loginHandler();
    Axios.get(window.env.REACT_APP_BACKEND_API + "/order/", {
      withCredentials: true,
    })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            setIsLoggedIn(false);
            setError("Please log in first.");
          } else
            setError(err.response.status + " " + err.response.data.message);
        }
      });
    return () => { };
  }, []);

  if (!isLoggedIn)
    return <Login loginHandler={loginHandler} redirectTo="/orders" />;

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <h1 className="has-text-centered title is-1 is-italic mb-6">
            Your orders
          </h1>
          {orders.map((x) => {
            return (
              <Order
                {...x}
                key={"order" + x._id}
                refreshOrders={refreshOrders}
                setError={setError}
              />
            );
          })}
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
      </div>
    </div>
  );
}

export default Orders;

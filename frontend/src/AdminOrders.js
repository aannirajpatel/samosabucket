import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { NavTab } from "react-router-tabs";
import AdminOrder from "./AdminOrder";
import Login from "./Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatedSwitch } from "react-router-transition";

function AdminOrders({ loginHandler }) {
  const match = { path: "/adminorders" };
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const refreshOrders = () => {
    Axios.get(window.env.REACT_APP_BACKEND_API + "/adminorder/", {
      withCredentials: true,
    })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
          setError(err.response.status + " " + err.response.data.message);
        }
      });
  };
  useEffect(() => {
    if (error !== "")
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
    Axios.get(window.env.REACT_APP_BACKEND_API + "/adminorder/", {
      withCredentials: true,
    })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
          setError(err.response.status + " " + err.response.data?.message);
        }
      });
    return () => { };
  }, []);

  if (!isLoggedIn)
    return <Login loginHandler={loginHandler} redirectTo="/adminorders" />;

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <h1 className="has-text-centered title is-1 is-italic mb-6">
            Customer orders
          </h1>
          <NavTab
            to="/adminorders/paid"
            className={
              "button is-info m-2 mb-5 " + (activeTab == 0 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(0);
            }}
          >
            PAID
          </NavTab>
          <NavTab
            to="/adminorders/preparing"
            className={
              "button is-info m-2 mb-5 " + (activeTab == 1 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(1);
            }}
          >
            PREPARING
          </NavTab>
          <NavTab
            to="/adminorders/delivering"
            className={
              "button is-info m-2 mb-5 " + (activeTab == 2 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(2);
            }}
          >
            DELIVERING
          </NavTab>
          <NavTab
            to="/adminorders/delivered"
            className={
              "button is-info m-2 mb-5 " + (activeTab == 3 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(3);
            }}
          >
            DELIVERED
          </NavTab>
          <NavTab
            to="/adminorders/cancelled"
            className={
              "button is-info m-2 mb-5 " + (activeTab == 4 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(4);
            }}
          >
            CANCELLED
          </NavTab>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route
              exact
              path={`${match.path}`}
              render={() => <Redirect replace to={`${match.path}/paid`} />}
            />
            <Route path={`${match.path}/paid`}>
              <br />
              <div className="subtitle box has-text-centered mb-2">
                {"Found " +
                  orders.filter((x) => x.status === "PAID").length +
                  " entries"}
              </div>
              <br />
              {orders
                .filter((x) => x.status === "PAID")
                .map((x) => {
                  return (
                    <AdminOrder
                      {...x}
                      key={"order" + x._id}
                      refreshOrders={refreshOrders}
                      setError={setError}
                    />
                  );
                })}
            </Route>
            <Route path={`${match.path}/preparing`}>
              <br />
              <div className="subtitle box has-text-centered mb-2">
                {"Found " +
                  orders.filter((x) => x.status === "PREPARING").length +
                  " entries"}
              </div>
              <br />
              {orders
                .filter((x) => x.status === "PREPARING")
                .map((x) => {
                  return (
                    <AdminOrder
                      {...x}
                      key={"order" + x._id}
                      refreshOrders={refreshOrders}
                      setError={setError}
                    />
                  );
                })}
            </Route>
            <Route path={`${match.path}/cancelled`}>
              <br />
              <div className="subtitle box has-text-centered mb-2">
                {"Found " +
                  orders.filter(
                    (x) =>
                      x.status === "USER_CANCELLED" ||
                      x.status === "ADMIN_CANCELLED"
                  ).length +
                  " entries"}
              </div>
              <br />
              {orders
                .filter(
                  (x) =>
                    x.status === "USER_CANCELLED" ||
                    x.status === "ADMIN_CANCELLED"
                )
                .map((x) => {
                  return (
                    <AdminOrder
                      {...x}
                      key={"order" + x._id}
                      refreshOrders={refreshOrders}
                      setError={setError}
                    />
                  );
                })}
            </Route>
            <Route path={`${match.path}/delivering`}>
              <br />
              <div className="subtitle box has-text-centered mb-2">
                {"Found " +
                  orders.filter((x) => x.status === "OUT_FOR_DELIVERY").length +
                  " entries"}
              </div>
              <br />
              {orders
                .filter((x) => x.status === "OUT_FOR_DELIVERY")
                .map((x) => {
                  return (
                    <AdminOrder
                      {...x}
                      key={"order" + x._id}
                      refreshOrders={refreshOrders}
                      setError={setError}
                    />
                  );
                })}
            </Route>
            <Route path={`${match.path}/delivered`}>
              <br />
              <div className="subtitle box has-text-centered">
                {"Found " +
                  orders.filter((x) => x.status === "DELIVERED").length +
                  " entries"}
              </div>
              <br />
              {orders
                .filter((x) => x.status === "DELIVERED")
                .map((x) => {
                  return (
                    <AdminOrder
                      {...x}
                      key={"order" + x._id}
                      refreshOrders={refreshOrders}
                      setError={setError}
                    />
                  );
                })}
            </Route>
          </AnimatedSwitch>
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

export default AdminOrders;

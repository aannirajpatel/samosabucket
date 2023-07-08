import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { NavTab } from "react-router-tabs";
import { AnimatedSwitch } from "react-router-transition";
import AdminProduct from "./AdminProduct";
import Login from "./Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProductCreate from "./AdminProductCreate";

function AdminProducts({ loginHandler }) {
  const match = { path: "/adminproducts" };
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const refreshProducts = () => {
    Axios.get(window.env.REACT_APP_BACKEND_API + "/adminproduct/", {
      withCredentials: true,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
          setError(
            "Error: " + err.response.status + " " + err.response.message
          );
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
    Axios.get(window.env.REACT_APP_BACKEND_API + "/adminproduct/", {
      withCredentials: true,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
          setError(
            "Error: " + err.response.status + " " + err.response.message
          );
        }
      });
    return () => { };
  }, []);

  if (!isLoggedIn)
    return <Login loginHandler={loginHandler} redirectTo="/adminproducts" />;

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <h1 className="has-text-centered title is-1 is-italic mb-6">
            Manage Store Product Listings
          </h1>
          <NavTab
            to="/adminproducts/available"
            className={
              "button is-info m-2 mb-5 " +
              (activeTab === 0 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(0);
            }}
          >
            AVAILABLE
          </NavTab>
          <NavTab
            to="/adminproducts/disabled"
            className={
              "button is-info m-2 mb-5 " +
              (activeTab === 1 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(1);
            }}
          >
            DISABLED
          </NavTab>
          <NavTab
            to="/adminproducts/add"
            className={
              "button is-primary m-2 mb-5 " +
              (activeTab === 2 ? "" : "is-outlined")
            }
            onClick={() => {
              setActiveTab(2);
            }}
          >
            + ADD PRODUCT
          </NavTab>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route
              exact
              path={`${match.path}`}
              render={() => <Redirect replace to={`${match.path}/available`} />}
            />
            <Route path={`${match.path}/available`}>
              <br />
              <div className="subtitle box has-text-centered mb-2">
                {"Found " +
                  products.filter((x) => x.available === "true").length +
                  " entries"}
              </div>
              <br />
              {products
                .filter((x) => x.available === "true")
                .map((x) => {
                  return (
                    <AdminProduct
                      {...x}
                      key={"product" + x._id}
                      refreshProducts={refreshProducts}
                      setError={setError}
                    />
                  );
                })}
            </Route>
            <Route path={`${match.path}/disabled`}>
              <br />
              <div className="subtitle box has-text-centered mb-2">
                {"Found " +
                  products.filter((x) => x.available === "false").length +
                  " entries"}
              </div>
              <br />
              {products
                .filter((x) => x.available === "false")
                .map((x) => {
                  return (
                    <AdminProduct
                      {...x}
                      key={"product" + x._id}
                      refreshProducts={refreshProducts}
                      setError={setError}
                    />
                  );
                })}
            </Route>
            <Route path={`${match.path}/add`}>
              <AdminProductCreate refreshProducts={refreshProducts} />
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

export default AdminProducts;

import Axios from "axios";
import React, { useState, useEffect, Component } from "react";
import CartItem from "./CartItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StripeCheckout from "react-stripe-checkout";
import Login from "./Login";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

import { Button, Form, Radio } from 'semantic-ui-react';

import "react-datepicker/dist/react-datepicker.css";
function Cart({ refreshCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState({});
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState("Saturday");

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

  const refreshCartPage = (suppressToast = false) => {
    Axios.get(process.env.REACT_APP_BACKEND_API + "/user/me", {
      withCredentials: true,
    })
      .then((res) => {
        setCartItems(res.data.cart);
        let amount = res.data.cart.reduce(
          (acc, ele) => acc + ele.price * ele.qty,
          0
        );
        setOrder({
          cart: res.data.cart,
          amount: amount,
          address: res.data.address,
        });
        setTotal(amount);
        setIsLoggedIn(true);
        if (!suppressToast) {
          toast.success("Cart updated!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        refreshCart();
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
    refreshCartPage(true);
    return () => {};
  }, []);

  const makePayment = (token) => {
    const body = {
      token,
      order,
      deliveryTime,
    };
    Axios({
      url: process.env.REACT_APP_BACKEND_API + "/order/",
      method: "post",
      data: body,
      withCredentials: true,
    })
      .then(async (res) => {
        await Axios.delete(process.env.REACT_APP_BACKEND_API + "/cart/", {
          withCredentials: true,
        });
        toast.success(
          "Order success!", 
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        refreshCartPage(true);
      })
      .catch((err) => {
        if (err.response)
          setError(err.response.data.message || "Error in payment.");
      });
  };

  function shoot() { //print function for testing
    var radios = document.getElementsByName('days');
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        // await setDeliveryTime(radios[i].value);
        // only one radio can be logically checked, don't check the rest
        break;
      }
    }
  }

  // const shoot = () => (
  //   var radios = document.getElementsByName('days'); //react form needs a form element
  //   for (var i = 0, length = radios.length; i < length; i++) {
  //     if (radios[i].checked) {
  //       await setDeliveryTime(radios[i].value);
  //       // only one radio can be logically checked, don't check the rest
  //       break;
  //     }
  //   }
  // )

  if (!isLoggedIn)
    return <Login loginHandler={refreshCartPage} redirectTo="/cart" />;
  return (
    <>
      <div className="title is-1 has-text-centered columns is-centered mb-5">
        <span className="is-italic column is-4">Review your order</span>
      </div>
      <div className="columns is-centered is-desktop">
        <div className="column is-half">
          {cartItems.map((x) => {
            return (
              <CartItem
                {...x}
                key={"cartItem" + x.itemId}
                refreshCart={refreshCartPage}
              />
            );
          })}
          {cartItems?.length === 0 && (
            <div className="title is-4 box">
              Grab a few snacks, and then be here, we'll get you a bill and the
              food will be on its way!
            </div>
          )}
        </div>
        <div className="column is-3 box p-4">
          <div className="title is-1 mb-1">Total: ${total}</div>
          <div className="container p-2">
            <b>Delivery address</b>
            <br />
            {order?.address?.line1}
            {order?.address?.line2 && (
              <>
                <br />
                {order?.address?.line2}
              </>
            )}
            <br />
            {order?.address?.city}, {order?.address?.state},{" "}
            {order?.address?.zip}
            <br />
            <hr className="m-0" />
            <Link to="/me">Change address</Link>
          </div>
          {total > 0 && (
            <div className="container p-2">
              <b>Set delivery date/time:</b>
              <br />
              {/* <DatePicker
                selected={deliveryTime}
                onChange={(time) => {
                  setDeliveryTime(time);
                }}
                showTimeSelect
                dateFormat="Pp"
                className="input my-2"
                placeholderText="Set delivery date/time"
                required={true}
                minDate={Date.now()}
              /> */}

              {/* RADIO BUTTON START */}
              <br />

              <Form.Group inline>
                <Form.Radio label="Saturday" checked={deliveryTime === 'Saturday'} value="Saturday" onClick={() => setDeliveryTime('Saturday')} />
                <Form.Radio label="Sunday" checked={deliveryTime === 'Sunday'} value="Sunday" onClick={() => setDeliveryTime('Sunday')} />
              </Form.Group>

              <br />
              {/* RADIO BUTTON END */}
              <br />
              <div className="pay-btn">
                <StripeCheckout
                  stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
                  token={makePayment}
                  name="Samosabucket Purchase"
                  amount={total * 100}
                >
                  <button className="button is-primary is-large mt-2" onClick={shoot}>
                    CONFIRM {`&`} PAY
                  </button>
                </StripeCheckout>
              </div>
            </div>
          )}
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
    </>
  );
}

export default Cart;

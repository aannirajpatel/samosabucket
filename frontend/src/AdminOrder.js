import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
function AdminOrder({
  stripePayID,
  status,
  cart,
  userId,
  amount,
  createdAt,
  _id,
  refreshOrders,
  setError,
  delivery_address: address,
  delivery_time,
  est_delivery_time,
  ...misc
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showDetails, setShowDetails] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [operationSelect, setOperationSelect] = useState(status);
  const [customer, setCustomer] = useState({ email: "", phone: "", name: "" });
  const [deliveryTime, setDeliveryTime] = useState(
    moment(est_delivery_time).utc().local().toDate()
  );
  const statusData = {
    ADMIN_CANCELLED: "Cancelled by SamosaBucket admin",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    USER_CANCELLED: "Cancelled by user",
    PAID: "Amount received",
    PREPARING: "Preparing",
  };
  const optionsData = [
    "ADMIN_CANCELLED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "PAID",
    "PREPARING",
  ];

  useEffect(() => {
    Axios.get(window.env.REACT_APP_BACKEND_API + "/user/me/" + userId, {
      withCredentials: true,
    })
      .then((res) => {
        if (res.data == null) {
          setCustomer({
            email: "User not found (deleted)",
            name: "N/A",
            phone: "N/A",
          });
          return;
        }
        setCustomer(res.data);
      })
      .catch((err) => {
        if (err.response) {
          toast.error("Error: " + err.response.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  }, []);
  useEffect(() => {
    if (showDetails === true) {
      setIsDetailsLoading(true);

      Axios.post(
        window.env.REACT_APP_BACKEND_API + "/adminproduct/list",
        cart.map((x) => x.itemId),
        {
          withCredentials: true,
        }
      )
        .then((res) => {
          setCartData(
            res.data.map((itemData) => {
              return {
                ...cart.find((x) => x.itemId === itemData._id),
                name: itemData.name,
              };
            })
          );
          setIsDetailsLoading(false);
        })
        .catch((err) => {
          if (err.response)
            setError(
              err.response.data.message || "Error while getting order details"
            );
        });
    }
    return () => { };
  }, [showDetails]);

  const updateOrder = () => {
    setIsUpdateLoading(true);
    Axios.put(
      window.env.REACT_APP_BACKEND_API + "/adminorder/" + _id,
      {
        status: operationSelect,
        est_delivery_time: deliveryTime,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        toast.success("Status updated", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        refreshOrders();
      })
      .catch((err) => {
        refreshOrders();
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        }
      });
  };

  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    <div className="columns is-centered is-vcentered box p-0 mb-5">
      <div className="column is-12 pl-3 pt-0 p-2">
        <p className="title is-4">
          Order {_id} for {customer?.name}
        </p>
        <p>
          <b>Amount:</b> ${amount}
          <br />
          <b>Created:</b> {moment(createdAt).format("hh:mm A, DD-MMM-YY")}
          <br />
          <b>Status:</b> {status}
          <br />
          <b>Requested delivery by: </b>
          {moment(delivery_time).utc().local().format("hh:mm A, DD-MMM-YY")}
        </p>
        <b>Estimated Delivery Time:</b>
        <br />
        <DatePicker
          name="estDelivery"
          selected={deliveryTime}
          onChange={(time) => {
            setDeliveryTime(time);
          }}
          showTimeSelect
          dateFormat="Pp"
          className="input my-2"
          placeholderText="Set est delivery date/time"
          required={true}
          minDate={Date.now()}
        />
        <br />
        <b>Modify status:</b>
        <br />
        <select
          className="input my-2"
          value={operationSelect}
          onChange={(e) => {
            setOperationSelect(e.target.value);
          }}
        >
          {optionsData.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="columns">
          <div className="column">
            <button className="button is-danger mr-1" onClick={updateOrder}>
              UPDATE STATUS
            </button>
          </div>
          <div className="column">
            <button
              className={
                "button is-info " + (isDetailsLoading ? "is-loading" : "")
              }
              onClick={() => {
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? "HIDE DETAILS" : "SHOW DETAILS"}
            </button>
          </div>
          <div className="column is-three-fifths"></div>
        </div>
        {showDetails && cartData?.length > 0 && (
          <div
            className={
              isDetailsLoading ? "is-loading has-background-light" : ""
            }
          >
            <div className="container p-2">
              <b>Customer Details</b>
              <br />
              <b>Name: </b> {customer?.name}, <b>E-mail: </b> {customer?.email},
              <b>Phone: </b>
              {customer?.phone}
              <br />
              <b>Stripe Pay ID: </b>
              {stripePayID}
              <br />
              <b>Delivery address</b>
              <br />
              {address?.line1}
              {address?.line2 && (
                <>
                  <br />
                  {address?.line2}
                </>
              )}
              <br />
              {address?.city}, {address?.state}, {address?.zip}
              <br />
            </div>
            <table className="table is-fullwidth p-2">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartData.map((x, index) => (
                  <tr key={"row" + x.itemId + (index + 1)}>
                    <td>{index + 1}</td>
                    <td>{x.name}</td>
                    <td>${x.price}</td>
                    <td>{x.qty}</td>
                    <td>${x.price * x.qty}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="4"></th>
                  <th>${amount}</th>
                </tr>
              </tfoot>
            </table>
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
  );
}

export default AdminOrder;

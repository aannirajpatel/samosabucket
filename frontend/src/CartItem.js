import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
function CartItem({ itemId, qty: quantity, delivery_time: dtime, refreshCart, spicy, side, vegetarian, dip, ...misc }) {
  const [item, setItem] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  let qty = quantity;
  let delivery_time = dtime;
  const deleteItem = () => {
    Axios.delete(process.env.REACT_APP_BACKEND_API + "/cart/" + itemId, {
      withCredentials: true,
    })
      .then((res) => {
        refreshCart();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
        }
      });
  };
  const updateCart = () => {
    Axios.post(
      process.env.REACT_APP_BACKEND_API + "/cart/",
      {
        itemId: itemId,
        qty: qty,
        delivery_time: delivery_time,
        spicy: spicy,
        side: side,
        vegetarian: vegetarian,
        dip: dip,
      },
      { withCredentials: true }
    )
      .then((res) => {
        refreshCart();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) setIsLoggedIn(false);
      });
  };
  const handleQty = (e) => {
    qty = e.target.value;
    updateCart();
  };
  const handleDTime = (e) => {
    delivery_time = e.target.value;
    updateCart();
  };
  useEffect(() => {
    Axios.get(process.env.REACT_APP_BACKEND_API + "/store/" + itemId)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) setIsLoggedIn(false);
      });
  }, [itemId]);
  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    item !== undefined && (
      <div className="columns is-mobile is-centered is-vcentered box p-0 mx-1 mb-4">
        <div className="column is-3 p-0">
          <figure className="image is-square">
            <img src={item.imageUrl} alt={"Photo of" + item.name} />
          </figure>
        </div>
        <div className="column is-9 pl-3 pb-0 pt-0">
          <p className="title is-4">{item.name}</p>
          <p className="subtitle is-5">${item.price}</p>
          <p className="subtitle is-6">{item.description}</p>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-danger" onClick={deleteItem}>
                REMOVE
              </button>
            </div>
            <div className="control pb-2">
              <div className="select">
                <select onChange={handleQty} value={qty}>
                  {[...Array(5)].map((x, index) => {
                    return (
                      <option key={"opt" + (index + 1) + item._id}>
                        {index + 1}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="select">
              <select onChange={handleDTime} value={delivery_time}>
                <option> Saturday, July 10 </option>
                <option> Sunday, July 11 </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default CartItem;

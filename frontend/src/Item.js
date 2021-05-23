import Axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
//added imports
import { Button, Modal } from 'react-bootstrap';

//start modal

const Example = ({ show, onClose, onSave }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
)


function Item({
  imageUrl,
  name,
  description,
  price,
  _id,
  refreshCart,
  ...misc
}) {
  const [qty, setQty] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showExample, setShowExample] = useState(false) //added

  const addToCart = () => {
    Axios.post(
      process.env.REACT_APP_BACKEND_API + "/cart/",
      {
        itemId: _id,
        qty: qty,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        console.log("post called")
        refreshCart();
        setShowExample(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        }
      });
  };
  const handleQty = (e) => {
    setQty(e.target.value);
  };
  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    <div className="columns is-mobile is-centered is-vcentered box p-0 mb-5">
      <div className="column is-3 p-1">
        <figure className="image is-square">
          <img src={imageUrl} alt={"Photo of" + name} />
        </figure>
      </div>
      <div className="column is-9 pl-3 pt-0 p-2">
        <p className="title is-4">{name}</p>
        <p className="subtitle is-5">${price}</p>
        <p className="subtitle is-6">{description}</p>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary" onClick={addToCart}>
              ADD TO CART
            </button>

            <Example //added
                show={showExample}
                onClose={() => setShowExample(false)}
                onSave={() => setShowExample(false)}
            />

          </div>
          <div className="control">
            <div className="select">
              <select onChange={handleQty} value={qty}>
                {[...Array(5)].map((x, index) => {
                  return (
                    <option key={"opt" + (index + 1) + _id}>{index + 1}</option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;

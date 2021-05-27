import Axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
//added imports
import { Button, Modal } from 'react-bootstrap';
// import 'semantic-ui-css/semantic.min.css'
import { Form, Radio } from 'semantic-ui-react';


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
  const [showModal, setShowModal] = useState(false) //added
  //start modal
  const [dip, setDip] = useState("Tamarind Sauce");
  const [isSpicy, setSpicy] = useState(false);
  const spicyChange = () => {
    setSpicy(!isSpicy);
  };
  const [isVegetarian, setVegetarian] = useState(false);
  const vegetarianChange = () => {
    setVegetarian(!isVegetarian);
  };

  const ItemModal = ({ show, onClose, onSave }) => (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Choose Dip
        <Form.Group inline>
                <Form.Radio label="Tamarind Sauce" checked={dip === 'Tamarind Sauce'} value="Tamarind Sauce" onClick={() => setDip('Tamarind Sauce')} />
                <Form.Radio label="Creamy Chilli" checked={dip === 'Creamy Chilli'} value="Creamy Chilli" onClick={() => setDip('Creamy Chilli')} />
                <Form.Radio label="Both" checked={dip === 'Both'} value="Both" onClick={() => setDip('Both')} />
        </Form.Group>
        <br></br>
        Additional options
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={isSpicy} onChange={spicyChange}/>
          <label class="form-check-label" for="flexCheckDefault">
            Make it spicy
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked={isVegetarian} onChange={vegetarianChange}/>
          <label class="form-check-label" for="flexCheckChecked">
            Vegetarian option
          </label>
        </div>
        <br></br>
        Quantity
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addToCart}>
          Add To Cart
        </Button>
      </Modal.Footer>
    </Modal>
  )

  const displayModal = () => {
    setShowModal(true);
  }

  const addToCart = () => {
    Axios.post(
      process.env.REACT_APP_BACKEND_API + "/cart/",
      {
        itemId: _id,
        qty: qty,
        dip: dip,
        spicy: isSpicy,
        vegetarian: isVegetarian,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        console.log("post called")
        refreshCart();
        setShowModal(false);
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
          <img src={imageUrl} alt={"Photo of " + name} />
        </figure>
      </div>
      <div className="column is-9 pl-3 pt-0 p-2">
        <p className="title is-4">{name}</p>
        <p className="subtitle is-5">{price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          })}
        </p>
        <p className="subtitle is-6">{description}</p>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary" onClick={displayModal}>
              ADD TO CART
            </button>

            <ItemModal //added
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={() => setShowModal(false)}
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

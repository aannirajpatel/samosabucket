import Axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
//added imports
import { Button, Modal } from 'react-bootstrap';
// import 'semantic-ui-css/semantic.min.css'
import { Form } from 'semantic-ui-react';


function Item({
  imageUrl,
  name,
  description,
  price,
  _id,
  refreshCart,
  ...misc
}) {
  let qty = 1;
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showModal, setShowModal] = useState(false)   //samosabucket - momo dumplings
  const [showModal2, setShowModal2] = useState(false)   //Samosabucket - chicken tikka

  //Samosabucket - momo dumplings
  let dip = "Tamarind Sauce";

  let isSpicy = false;
  const spicyChange = () => {
    isSpicy = !isSpicy;
  };
  let isVegetarian = false;
  const vegetarianChange = () => {
    isVegetarian = !isVegetarian;
  };
  //Samosabucket - momo dumplings

  //Samosabucket - chicken tikka
  let side = "Rice";
  //Samosabucket - chicken tikka


  //samosabucket - momo dumplings
  const ItemModal = ({ show, onClose, onSave }) => (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Choose Dip
        <div>
          <input type="radio" value="Tangy Tomato" name="Choose Dip" defaultChecked onClick={() => dip = 'Tangy Tomato'} /> Tangy Tomato<br />
          <input type="radio" value="Dumpling Sauce" name="Choose Dip" onClick={() => dip = 'Dumpling Sauce'} /> Dumpling Sauce<br />
          <input type="radio" value="Both" name="Choose Dip" onClick={() => dip = 'Both'} /> Both<br />
        </div>
        <br></br>
        Additional options
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={spicyChange} />
          <label class="form-check-label" for="flexCheckDefault">
            Make it spicy
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={vegetarianChange} />
          <label class="form-check-label" for="flexCheckChecked">
            Vegan option
          </label>
        </div>
        <br></br>
        Quantity
        <div className="control">
          <div className="select">
            <select onChange={handleQty}>
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
  //samosabucket - momo dumplings

  //Samosabucket - chicken tikka
  const ItemModal2 = ({ show, onClose, onSave }) => (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Choose Side
        <div>
          <input type="radio" value="White Rice" name="Choose Side" defaultChecked onClick={() => side = 'White Rice'} />White Rice<br />
          <input type="radio" value="Bhature Bread" name="Choose Side" onClick={() => side = 'Bhature Bread'} /> Bhature Bread<br />
        </div>
        <br></br>
        Additional options
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={spicyChange} />
          <label class="form-check-label" for="flexCheckDefault">
            Make it spicy
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={vegetarianChange} />
          <label class="form-check-label" for="flexCheckChecked">
            Vegan option
          </label>
        </div>
        <br></br>
        Quantity
        <div className="control">
          <div className="select">
            <select onChange={handleQty}>
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
  //Samosabucket - chicken tikka

  const displayModal = () => {
    if (_id === "60e3a111557dc20017253d84") {  //samosabucket - momo dumplings
      setShowModal(true);
      return;
    } else if (_id === "60e3a121557dc20017253d87") { //samosabucket - momo dumplings
      setShowModal(true);
      return;
    } else if (_id === "60ebcb00cd34f90017ac82c7") {
      setShowModal2(true);
      return;
    }
    addToCart();
  }

  const addToCart = () => {
    Axios.post(
      process.env.REACT_APP_BACKEND_API + "/cart/",
      {
        itemId: _id,
        qty: qty,
        //samosabucket - momo dumplings
        dip: dip,
        spicy: isSpicy,
        vegetarian: isVegetarian,
        //samosabucket - momo dumplings
        //Samosabucket - chicken tikka
        side: side,
        //Samosabucket - chicken tikka
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        refreshCart();
        setShowModal(false); //samosabucket - momo dumplings
        setShowModal2(false); //samosabucket - chicken tikka
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        }
      });
  };
  const handleQty = (e) => {
    qty = e.target.value;
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

            <ItemModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onSave={() => setShowModal(false)}
            />

            <ItemModal2
              show={showModal2}
              onClose={() => setShowModal2(false)}
              onSave={() => setShowModal2(false)}
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

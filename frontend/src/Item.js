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
  restaurant,
  ...misc
}) {
  let qty = 1;
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showModal, setShowModal] = useState(false)   //samosabucket - momo dumplings
  const [showModal2, setShowModal2] = useState(false)   //samosabucket - chicken tikka
  const [showModal3, setShowModal3] = useState(false)   //samosabucket - samosas
  const [showModal4, setShowModal4] = useState(false)   //vegan flava cafe - Too Tasty Walnut Tacos
  const [showModal5, setShowModal5] = useState(false)   //vegan flava cafe - Mock Fish Cake


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

  //vegan flava cafe
  let mainItem = "salad";
  let tacoShell = "Hard shell";
  //vegan flava cafe


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

  //samosabucket - samosas
  const ItemModal3 = ({ show, onClose, onSave }) => (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Choose Dip
        <div>
          <input type="radio" value="Tamarind" name="Choose Samosas" defaultChecked onClick={() => dip = 'Tamarind'} /> Tamarind<br />
          <input type="radio" value="Creamy Chilli" name="Choose Samosas" onClick={() => dip = 'Creamy Chilli'} /> Creamy Chilli<br />
          <input type="radio" value="Both" name="Choose Samosas" onClick={() => dip = 'Both'} /> Both<br />
        </div>
        <br></br>
        Additional options
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={spicyChange} />
          <label class="form-check-label" for="flexCheckDefault">
            Make it spicy
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
  //samosabucket - samosas

  //vegan flava cafe - Too Tasty Walnut Tacos
  const ItemModal4 = ({ show, onClose, onSave }) => (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input type="radio" value="Salad" name="vegan flava cafe" defaultChecked onClick={() => mainItem = 'Salad'} /> Salad<br />
          <input type="radio" value="Seaweed Wrap" name="vegan flava cafe" onClick={() => mainItem = 'Seaweed Wrap'} /> Seaweed Wrap<br />
          <input type="radio" value="Collard Green Wrap" name="vegan flava cafe" onClick={() => mainItem = 'Collard Green Wrap'} /> Collard Green Wrap<br />
        </div>
        <br></br>
        Choose Hard Taco Shell
        <div>
          <input type="radio" value="Salad" name="vegan flava cafe2" defaultChecked onClick={() => mainItem = 'Hard Shells'} /> Hard Shells<br />
          <input type="radio" value="Seaweed Wrap" name="vegan flava cafe2" onClick={() => mainItem = 'Nacho Shells'} /> Nacho Shells<br />
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
  //vegan flava cafe - Too Tasty Walnut Tacos

  //vegan flava cafe - Mock Fish Cake
  const ItemModal5 = ({ show, onClose, onSave }) => (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input type="radio" value="Salad" name="vegan flava cafe3" defaultChecked onClick={() => mainItem = 'Salad'} /> Salad<br />
          <input type="radio" value="Seaweed Wrap" name="vegan flava cafe3" onClick={() => mainItem = 'Seaweed Wrap'} /> Seaweed Wrap<br />
          <input type="radio" value="Collard Green Wrap" name="vegan flava cafe3" onClick={() => mainItem = 'Collard Green Wrap'} /> Collard Green Wrap<br />
        </div>
        <br></br>
        Choose Hard Taco Shell
        <div>
          <input type="radio" value="Salad" name="vegan flava cafe4" defaultChecked onClick={() => mainItem = 'Hard Shells'} /> Hard Shells<br />
          <input type="radio" value="Nacho Style" name="vegan flava cafe4" onClick={() => mainItem = 'Nacho Style'} /> Nacho Style<br />
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
  //vegan flava cafe - Mock Fish Cake

  const displayModal = () => {
    if (_id === "60e3a111557dc20017253d84") {  //samosabucket - momo dumplings
      setShowModal(true);
      return;
    } else if (_id === "60e3a121557dc20017253d87") { //samosabucket - momo dumplings
      setShowModal(true);
      return;
    } else if (_id === "60ebcb00cd34f90017ac82c7") { //Samosabucket - chicken tikka
      setShowModal2(true);
      return;
    } else if (_id === "60f892c28b572f0017ef81ed") { //samosabucket - samosa
      setShowModal3(true);
      return;
    } else if (_id === "60dcf34954590a0017027dd4") { //vegan flava cafe - Too Tasty Walnut Tacos
      setShowModal4(true);
      return;
    } else if (_id === "60dcf48854590a0017027dd5") { //vegan flava cafe - Too Tasty Walnut Tacos
      setShowModal5(true);
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
        //vegan flava cafe
        mainItem: mainItem,
        tacoShell: tacoShell,
        //vegan flava cafe
        restaurant: restaurant,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        refreshCart();
        setShowModal(false); //samosabucket - momo dumplings
        setShowModal2(false); //samosabucket - chicken tikka
        setShowModal3(false); //samosabucket - chicken tikka
        setShowModal4(false); //vegan flava cafe - Too Tasty Walnut Tacos
        setShowModal5(false); //vegan flava cafe - Mock Fish Cake
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
        <p className="subtitle is-5 is-italic">{restaurant}</p>
        <p className="subtitle is-6">{description}</p>
        <div className="columns is-mobile">
          <div className="column">
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
                <ItemModal3
                  show={showModal3}
                  onClose={() => setShowModal3(false)}
                  onSave={() => setShowModal3(false)}
                />

                <ItemModal4
                  show={showModal4}
                  onClose={() => setShowModal4(false)}
                  onSave={() => setShowModal4(false)}
                />

                <ItemModal5
                  show={showModal5}
                  onClose={() => setShowModal5(false)}
                  onSave={() => setShowModal5(false)}
                />

              </div>
            </div>
          </div>
          <div className="column">
            <p className="subtitle is-5 has-text-right">{price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;

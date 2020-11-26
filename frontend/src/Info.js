import React from "react";
function Info() {
  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-three-quarters box">
          <div className="title has-text-centered is-italic">Help</div>
          <div className="subtitle">How to order</div>
          <p>
            <ol>
              <li>Add things to the cart</li>
              <li>Open the cart and pick a delivery date and time</li>
              <li>Click on CONFIRM {"&"} PAY, then complete the payment.</li>
            </ol>
          </p>
          <div className="subtitle">
            Having issues? Business queries? Reach out to us:
          </div>
          <p>Phone: +1-919-123-4567</p>
          <p>
            Email: <a href="mailto:example@gmail.com">example@gmail.com</a>
          </p>
          <p>
            Policy:{" "}
            <a href="https://www.google.com/" target="_blank">
              this
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Info;

import React from "react";
function Info() {
  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-three-quarters box">
          <div className="title is-3 has-text-centered">Help / Contact</div>
          <div className="subtitle">How to order:</div>
          <div>
            <p>
              <ol>
                <li>Add desired items to cart in the "Shop" tab</li>
                <li>Once ready to order go to "Cart" tab and select delivery day</li>
                <li>To update address or add special instructions, click on "change address" or go to "Profile" tab</li>
                <li>Click on CONFIRM {"&"} PAY to complete order</li>
              </ol>
            </p>
          </div>
          <div className="subtitle">Payment:</div>
          <div>
            <p>
              Enter <b> 4242 4242 4242 4242 </b> for the credit card number,  <b>any three digit CVC code</b>, and <b>any future date</b> for the date. 
              These are imaginary credit card details used for testing as our web app is in the beta version and does not handle real credit information.
            </p>
          </div>
          <hr></hr>
          <div className="subtitle is-3 has-text-centered">Got questions? We're here for you.</div>
          <p>
            Email: <a href="mailto:example@gmail.com">shasj@live.unc.edu</a>
          </p>
          <p>
            Text: <a href="tel:+1-919-904-5109">+1-919-904-5109</a>
          </p>
          {/* <p>
            Policy:{" "}
            <a href="https://www.google.com/" target="_blank">
              Coming Soon
            </a>
          </p> */}
          <br></br>
          <br></br>
          <div className="has-text-centered">
            <small>
              Made with ❤️ using the open source project {" "}
              <a href="https://github.com/aannirajpatel/samosabucket">
                Samosabucket
              </a>{" "}
              by <a href="https://aanpatel.tech">Aan Patel</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;

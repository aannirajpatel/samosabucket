import React from "react";
function Info() {
  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-three-quarters box">
          <br></br>

          <div class="column">
            <div className="subtitle has-text-centered">
              Ordering:
            </div>
            <p>
              <ol>
                <li>Add items to cart</li>
                <li>Go to "Cart" and select delivery day</li>
                <li>To add special instructions select "change address"</li>
                <li>Click on CONFIRM {"&"} PAY to complete order</li>
              </ol>
            </p>
          </div>

          <br></br>
          <hr></hr>
          <br></br>
          <br></br>
          <div className="subtitle is-3 has-text-centered">Got questions? We're here for you.</div>
          <br></br>
          <br></br>
          <div class="columns has-text-centered">
            <div class="column">
              <p>
                Email: <a href="mailto:example@gmail.com">team@cloudeats.app</a>
              </p>
            </div>
            <div class="column">
              <p>
                Text: <a href="tel:+1-919-904-5109">+1-919-904-5109</a>
              </p>
            </div>
          </div>
          {/* <div class="columns">
            <div class="column">
              <a href="https://www.google.com" target="_blank">
                About Us - Coming Soon
              </a>
            </div>
            <div class="column">
              <a href="https://www.google.com" target="_blank">
                Kitchens - Coming Soon
              </a>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <a href="https://www.google.com" target="_blank">
                Terms of Service - Coming Soon
              </a>
            </div>
            <div class="column">
              <a href="https://www.google.com" target="_blank">
                Private Policy - Coming Soon
              </a>
            </div>
          </div> */}
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
      <br></br>
    </div>
  );
}

export default Info;

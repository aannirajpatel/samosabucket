import React from "react";
function Info() {
  return (
    <div className="container">
      <div className="columns is-centered is-vcentered">
        <div className="column is-three-quarters box">
          <div className="title has-text-centered is-italic">Help</div>
          <div className="subtitle mb-2">How to order</div>
          <div className="container is-fluid mb-3">
            <ol>
              <li>Add things to the cart</li>
              <li>Open the cart and pick a delivery date and time</li>
              <li>Click on CONFIRM {"&"} PAY, then complete the payment.</li>
            </ol>
          </div>
          <div className="subtitle">Having issues? Reach out to us!</div>
          <p>
            Report an issue via GitHub:{" "}
            <a href="https://github.com/aannirajpatel/samosabucket/issues">Click here</a>
          </p>
          <p>
            Email: <a href="mailto:aanpatel.tech@gmail.com">aanpatel.tech@gmail.com</a>
          </p>
          <div className="container is-fluid">
            Policy and Terms of Use:
            <div className="container">
              <strong>DISCLAIMER: This is a demo web application provided for informational and educational purposes only. By accessing and using this demo web application, you agree that:</strong>
              <ul>
                <li>The information and content provided within this web application are for demonstration purposes only. They may not be accurate, complete, or up to date.</li>
                <li>The functionality and features of this web application may not be fully implemented or optimized.</li>
                <li>Any actions you take or information you provide within this web application are at your own risk.</li>
                <li>This web application may contain third-party content, links, or resources that are not under our control. The creator of this application is not responsible for the availability, accuracy, or reliability of any such external resources.</li>
                <li>The creator of this web application makes no representations or warranties of any kind, expressed or implied, regarding the operation or availability of this web application.</li>
                <li>The creator of this web application disclaims all liability for any damages or losses, including but not limited to direct, indirect, incidental, consequential, or punitive damages, arising out of or in connection with your use of this web application.</li>
              </ul>
            </div>
          </div>
          <small>
            Built using <a href="https://aanpatel.tech">Aan Patel</a>'s open source project{" "}
            <a href="https://github.com/aannirajpatel/samosabucket">
              Samosabucket
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Info;

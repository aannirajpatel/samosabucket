import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AdminProduct({
  imageUrl,
  name,
  description,
  price,
  available,
  _id,
  refreshProducts,
  ...misc
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [showEditor, setShowEditor] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [dataImage, setDataImage] = useState(imageUrl);
  const [dataName, setDataName] = useState(name);
  const [dataPrice, setDataPrice] = useState(price);
  const [dataDesc, setDataDesc] = useState(description);
  const [dataAvailable, setDataAvailable] = useState(available === "true");

  const updateProduct = () => {
    setIsUpdateLoading(true);
    Axios.put(
      window.env.REACT_APP_BACKEND_API + "/adminproduct/" + _id,
      {
        available: dataAvailable,
        imageUrl: dataImage,
        name: dataName,
        price: dataPrice,
        description: dataDesc,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        toast.success("Product updated", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        refreshProducts();
        setIsUpdateLoading(false);
      })
      .catch((err) => {
        refreshProducts();
        if (err.response) {
          if (err.response.status === 401) setIsLoggedIn(false);
        }
        setIsUpdateLoading(false);
      });
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    window.cloudinary.openUploadWidget(
      {
        cloudName: window.env.REACT_APP_CLOUDINARY_CLOUDNAME,
        uploadPreset:
          window.env.REACT_APP_CLOUDINARY_UPLOADPRESET || "samosabucket",
        folder: window.env.REACT_APP_CLOUDINARY_FOLDER || "samosabucket",
        sources: ["local", "url"],
        maxFiles: 1,
        cropping: true,
        croppingAspectRatio: 1,
        clientAllowedFormats: [
          "png",
          "gif",
          "jpeg",
          "tif",
          "tiff",
          "bmp",
          "jpg",
          "webp",
        ],
      },
      (err, res) => {
        if (res.event === "success") {
          setDataImage(res.info.secure_url);
        }
      }
    );
  };

  if (!isLoggedIn) return <Redirect to="/login" />;
  return (
    <>
      <div className="columns is-centered is-vcentered box p-0 mb-5">
        <div className="column is-3 p-1">
          <figure className="image is-square">
            <img src={dataImage} alt={"Photo of" + name} />
          </figure>
        </div>
        <div className="column is-9 pl-3 pt-0 p-2">
          <p className="title is-4">Product {_id}</p>
          {!showEditor && (
            <div className="subtitle is-5">
              <b>Product Name: </b>
              {name} <br />
              <b>Price:</b> ${price}
              <br />
              <b>Product Description</b>
              <p>{description}</p>
            </div>
          )}
          {showEditor && (
            <div className="container">
              <form class="form-horizontal">
                <fieldset>
                  <legend></legend>
                  <div class="field">
                    <label class="label" htmlFor="productname">
                      Product Name
                    </label>
                    <div class="control">
                      <input
                        id="productname"
                        name="productname"
                        type="text"
                        class="input"
                        required=""
                        value={dataName}
                        onChange={(e) => {
                          setDataName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label" htmlFor="price">
                      Price
                    </label>
                    <div class="control">
                      <input
                        id="price"
                        name="price"
                        type="text"
                        class="input "
                        required=""
                        value={dataPrice}
                        onChange={(e) => {
                          setDataPrice(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label" htmlFor="description">
                      Product Description
                    </label>
                    <div class="control">
                      <textarea
                        class="textarea"
                        id="description"
                        name="description"
                        value={dataDesc}
                        onChange={(e) => {
                          setDataDesc(e.target.value);
                        }}
                      ></textarea>
                    </div>
                  </div>
                  <div className="field is-grouped">
                    <div className="control">
                      <button
                        className="button is-info my-2"
                        onClick={handleImageUpload}
                      >
                        Upload new pic 📁
                      </button>
                    </div>
                    <div className="control">
                      <button
                        className={
                          "button my-2 " +
                          (dataAvailable ? "is-primary" : "is-danger")
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setDataAvailable(!dataAvailable);
                        }}
                      >
                        <b>
                          {dataAvailable
                            ? "PRODUCT AVAILABLE"
                            : "PRODUCT DISABLED"}
                        </b>
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
              URL to be set: <pre>{dataImage}</pre>
            </div>
          )}
          <div className="field is-grouped">
            <div className="control">
              <button
                className={
                  "button is-danger mr-1 " +
                  (isUpdateLoading ? "is-loading" : "")
                }
                onClick={updateProduct}
              >
                UPDATE
              </button>
            </div>
            <div className="control">
              <button
                className="button is-info"
                onClick={() => {
                  setShowEditor(!showEditor);
                }}
              >
                {showEditor ? "HIDE EDITOR" : "SHOW EDITOR"}
              </button>
            </div>
          </div>
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
    </>
  );
}

export default AdminProduct;

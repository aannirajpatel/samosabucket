import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function AdminProductCreate({ refreshProducts, ...misc }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true); //assume logged in already.
  const [isCreationLoading, setIsCreationLoading] = useState(false);
  const [dataImage, setDataImage] = useState("");
  const [dataName, setDataName] = useState("");
  const [dataPrice, setDataPrice] = useState("");
  const [dataDesc, setDataDesc] = useState("");
  const [dataAvailable, setDataAvailable] = useState(true);

  const createProduct = () => {
    setIsCreationLoading(true);
    Axios.post(
      window.env.REACT_APP_BACKEND_API + "/adminproduct/",
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
        toast.success("Product added", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsCreationLoading(false);
        setDataImage("");
        setDataDesc("");
        setDataName("");
        setDataAvailable(true);
        setDataPrice("");
        refreshProducts();
      })
      .catch((err) => {
        refreshProducts();
        if (err.response?.status === 401) {
          setIsLoggedIn(false);
        }
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
            {dataImage && <img src={dataImage} alt={"Photo of" + dataName} />}
          </figure>
        </div>
        <div className="column is-9 pl-3 pt-0 p-2">
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
                      Upload pic 📁
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
            <div className="container my-2">
              {" "}
              Image URL to be set: <pre>{dataImage}</pre>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className={
                  "button is-danger mr-1 " +
                  (isCreationLoading ? "is-loading" : "")
                }
                onClick={createProduct}
              >
                ADD PRODUCT
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

export default AdminProductCreate;

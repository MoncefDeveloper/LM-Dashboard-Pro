import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import "../tables.css";
import "./product.css";
import axios from "axios";
import UpdateProductForm from "../../Components/forms/product-update-form";

const UpdateProduct = () => {
  const push = useNavigate();
  const [msg, setMsg] = useState("Null");
  const [showMsg, setShowMsg] = useState(false);
  const [categories, setCategories] = useState([]);
  const [prevData, setPrevData] = useState(false);
  const { id } = useParams();
  const replace = useNavigate();

  // Get Categories
  const getCategories = () => {
    const myObj = new FormData();
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/getCategories", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setCategories(data.data.categories);
          } else {
            setShowMsg(true);
            setMsg(data.data.msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Update Product Fucntion
  const handleData = (data) => {
    const {
      id,
      name,
      price,
      role,
      description,
      details,
      category,
      active,
      trend,
    } = prevData;
    if (
      data.product_img === "" &&
      data.product_img_back === "" &&
      data.name === name &&
      data.description === description &&
      data.details === details &&
      data.active?.toString() === active?.toString() &&
      data.price === price &&
      data.role === role &&
      data.category.toString() === category.id.toString() &&
      data.trend?.toString() === trend?.toString()
    ) {
      push("/table/products/");
    } else {
      const myObj = new FormData();
      data.product_img !== "" &&
        myObj.append(
          "image_name",
          data.product_img[0],
          data.product_img[0].name
        );
      data.product_img_back !== "" &&
        myObj.append(
          "back_image_name",
          data.product_img_back[0],
          data.product_img_back[0].name
        );
      data.description !== description &&
        myObj.append("description", data.description);
      data.details !== details && myObj.append("details", data.details);
      data.price !== price && myObj.append("price", data.price);
      data.category.toString() !== category.id.toString() &&
        myObj.append("category_id", data.category);
      data.name !== name && myObj.append("name", data.name);
      data.role !== role && myObj.append("role", data.role);
      data.active?.toString() !== active?.toString() &&
        myObj.append("active", data.active?.toString());
      data.trend?.toString() !== trend?.toString() &&
        myObj.append("trend", data.trend?.toString());
      myObj.append("id", id);
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/update", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              push("/table/products/");
            } else {
              setShowMsg(true);
              setMsg(data.data.msg);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // get Product details
  const productData = useCallback(() => {
    const myObj = new FormData();
    myObj.append("id", id);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/oneProduct", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setPrevData(data.data.product);
          } else {
            setShowMsg(true);
            setMsg(data.data.msg);
            replace("/Error/404", replace);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  // hidden the error msg
  useEffect(() => {
    let hiddenMsg = setTimeout(() => {
      setShowMsg(false);
    }, 5000);
    return () => clearTimeout(hiddenMsg);
  }, [showMsg]);

  // Get Categories
  useEffect(() => {
    getCategories();
    productData();
  }, [productData]);

  return prevData ? (
    <section className="add-form">
      <div className={`msg-box ${showMsg && "msg-box-show"}`}>
        {" "}
        <div className="sym">
          <BiError />
        </div>{" "}
        {msg}
      </div>
      <div className="msg-confirmation"></div>
      <header>
        <div className="title">Update Product</div>
      </header>
      <UpdateProductForm
        handleData={handleData}
        categories={categories}
        product={prevData}
      />
      <div className="exit">
        <Link className="sym" to={"/table/products"}>
          <IoExit />
        </Link>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default UpdateProduct;

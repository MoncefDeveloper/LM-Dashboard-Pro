import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import "../tables.css";
import "./product.css";
import axios from "axios";
import AddProductForm from "../../Components/forms/product-add-form";

const AddProduct = () => {
  const push = useNavigate();
  const [msg, setMsg] = useState("Null");
  const [showMsg, setShowMsg] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const handleData = (data) => {
    const myObj = new FormData();
    myObj.append("image", data.product_img[0], data.product_img[0].name);
    myObj.append(
      "back_image",
      data.product_img_back[0],
      data.product_img_back[0].name
    );
    myObj.append("description", data.description);
    myObj.append("details", data.details);
    myObj.append("price", data.price);
    myObj.append("category_id", data.category);
    myObj.append("role", data.role);
    myObj.append("name", data.name);
    myObj.append("active", data.active);
    myObj.append("trend", data.trend);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/product", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data?.data?.status) {
            push("/table/products/");
          } else {
            setShowMsg(true);
            setMsg(data?.data?.msg);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // hidden the error msg
  useEffect(() => {
    let hiddenMsg = setTimeout(() => {
      setShowMsg(false);
    }, 5000);
    return () => clearTimeout(hiddenMsg);
  }, [showMsg]);

  //getCategories
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className="add-form">
      <div className={`msg-box ${showMsg && "msg-box-show"}`}>
        {" "}
        <div className="sym">
          <BiError />
        </div>{" "}
        {msg}
      </div>
      <header>
        <div className="title">Add Product</div>
      </header>
      <AddProductForm handleData={handleData} categories={categories} />
      <div className="exit">
        <Link className="sym" to={"/table/products"}>
          <IoExit />
        </Link>
      </div>
    </section>
  );
};

export default AddProduct;

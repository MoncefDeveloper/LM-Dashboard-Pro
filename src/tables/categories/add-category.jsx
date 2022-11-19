import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import "../tables.css";
import "./categories.css";
import axios from "axios";
import AddCategoryForm from "../../Components/forms/category-add-form";

const AddCategory = () => {
  const push = useNavigate();
  const [msg, setMsg] = useState("Null");
  const [showMsg, setShowMsg] = useState(false);

  const handleData = (data) => {
    const myObj = new FormData();
    // myObj.append('image', data.category_img[0], data.category_img[0].name);
    myObj.append("image", data.category_img[0]);
    myObj.append("name", data.name);
    myObj.append("active", data.active);
    myObj.append("description", data.description);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/AddCategory", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            push("/table/categories/");
          } else {
            setShowMsg(true);
            setMsg(data.data.msg);
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
        <div className="title">Add Category</div>
      </header>
      <AddCategoryForm handleData={handleData} />
      <div className="exit">
        <Link className="sym" to={"/table/categories"}>
          <IoExit />
        </Link>
      </div>
    </section>
  );
};

export default AddCategory;

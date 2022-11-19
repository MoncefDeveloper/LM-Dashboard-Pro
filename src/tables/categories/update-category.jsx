import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import "../tables.css";
import "./categories.css";
import axios from "axios";
import UpdateCategoryForm from "../../Components/forms/category-update-form";

const UpdateCategory = () => {
  const push = useNavigate();
  const replace = useNavigate();
  const [msg, setMsg] = useState("Null");
  const [showMsg, setShowMsg] = useState(false);
  const [prevData, setPrevData] = useState(false);
  const { id } = useParams();

  // Update Category Fucntion
  const handleData = (data) => {
    const { id, name, active, description } = prevData;
    if (
      data.category_img === "" &&
      data.name === name &&
      data.description === description &&
      data.active?.toString() === active?.toString()
    ) {
      push("/table/categories");
    } else {
      const myObj = new FormData();
      data.category_img !== "" &&
        myObj.append(
          "image_name",
          data.category_img[0],
          data.category_img[0].name
        );
      data.name !== name && myObj.append("name", data.name);
      data.description !== description &&
        myObj.append("description", data.description);
      data.active?.toString() !== active?.toString() &&
        myObj.append("active", data.active?.toString());
      myObj.append("id", id);
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/UpdateProduct", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              push("/table/categories");
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

  // get Category details
  const categoryData = useCallback(() => {
    const myObj = new FormData();
    myObj.append("id", id);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/oneCategory", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setPrevData(data.data.category);
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
    categoryData();
  }, [categoryData]);

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
        <div className="title">Update Category</div>
      </header>
      <UpdateCategoryForm handleData={handleData} category={prevData} />
      <div className="exit">
        <Link className="sym" to={"/table/categories"}>
          <IoExit />
        </Link>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default UpdateCategory;

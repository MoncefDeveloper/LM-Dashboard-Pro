import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoExit } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import "../tables.css";
import "./admins.css";
import axios from "axios";
import AddAdminForm from "../../Components/forms/admin-add-form";

const AddAdmin = () => {
  const push = useNavigate();
  const [msg, setMsg] = useState("Null");
  const [showMsg, setShowMsg] = useState(false);

  const handleData = (data) => {
    const myObj = new FormData();
    myObj.append("image", data.admin_img[0], data.admin_img[0].name);
    myObj.append("name", data.name);
    myObj.append("email", data.email);
    myObj.append("phone", data.phone);
    myObj.append("password", data.password);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/AddAdmin", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            push("/table/admins/");
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
        <div className="title">Add Admin</div>
      </header>
      <AddAdminForm handleData={handleData} />
      <div className="exit">
        <Link className="sym" to={"/table/admins"}>
          <IoExit />
        </Link>
      </div>
    </section>
  );
};

export default AddAdmin;

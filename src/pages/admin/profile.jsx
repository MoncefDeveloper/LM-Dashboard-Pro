import React, { useEffect, useState } from "react";
import "./security.css";
import female from "../../assets/images/undraw_female_avatar_w3jk.svg";
import { AiOutlineUser } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../context/context";
import axios from "axios";

const Profile = () => {
  const [newImg, setNewImg] = useState(female);
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });
  const { admin, setAdmin } = useGlobalContext();
  // useForm for react-hook-form
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  });

  // Update Category Fucntion
  const handleData = (data) => {
    if (admin) {
      const { id, name, email, phone, type } = admin;
      if (type !== +process.env.REACT_APP_VISITOR_KEY) {
        if (
          data.name === name &&
          data.email === email &&
          data.phone === phone &&
          !data.admin_img.length
        ) {
          setShowMsg({
            show: true,
            msg: "Nothing to update" + type,
            error: true,
          });
        } else {
          const myObj = new FormData();
          data.admin_img.length &&
            myObj.append(
              "image_name",
              data.admin_img[0],
              data.admin_img[0].name
            );
          data.name !== name && myObj.append("name", data.name);
          data.email !== email && myObj.append("email", data.email);
          data.phone !== phone && myObj.append("phone", data.phone);
          myObj.append("id", id);
          myObj.append(
            "api_password",
            "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
          );
          try {
            axios
              .post(process.env.REACT_APP_API_URL + "api/updateAdmin", myObj, {
                withCredentials: true,
              })
              .then((data) => {
                if (data.data.status) {
                  setShowMsg({ show: true, msg: data.data.msg, error: false });
                  setAdmin(data.data.admin);
                } else {
                  setShowMsg({ show: true, msg: data.data.msg, error: true });
                }
              });
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        setShowMsg({
          show: true,
          msg: "You can't change anything ,You are visitor",
          error: true,
        });
        reset();
      }
    }
  };

  // Reset Data
  useEffect(() => {
    if (admin) {
      const { name, email, image_name, phone } = admin;
      image_name &&
        setNewImg(
          `${process.env.REACT_APP_API_URL}Product/admin/${admin?.image_name}`
        );
      reset({
        name: name,
        email: email,
        phone: phone,
        admin_img: "",
      });
    }
  }, [admin, reset]);

  // showing img
  const handleImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewImg(reader.result);
      }
    };
    e.target.files[0]
      ? reader.readAsDataURL(e.target.files[0])
      : setNewImg(
          `${process.env.REACT_APP_API_URL}Product/admin/${admin.image_name}`
        );
  };

  // hidden Msg
  useEffect(() => {
    const hidden = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, 5000);
    return () => clearTimeout(hidden);
  }, [showMsg]);

  return (
    <section className="profile">
      <div
        className={`msg-box ${showMsg.show && "msg-box-show"} ${
          showMsg.error && "msg-box-error"
        }`}
      >
        {" "}
        <div className="sym">
          <BiError />
        </div>{" "}
        {showMsg.msg}
      </div>
      <div className="title">
        <div className="logo">
          <AiOutlineUser />
        </div>{" "}
        Account Settings - Profile
      </div>
      <form className="update-box" onSubmit={handleSubmit(handleData)}>
        <div className="left">
          <div className="ft-picture">
            <div className="img">
              <img src={newImg} alt="img" />
            </div>
            <div className="role">JPG or PNG no larger than 1 MB</div>
            <label htmlFor="file" className="btn-prem">
              Upload new image
              <div className="form">
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => {
                    setValue("admin_img", e.target.value.files);
                  }}
                  {...register("admin_img", {
                    onChange: handleImg,
                  })}
                />
              </div>
            </label>
          </div>
        </div>
        <div className="right">
          <div className="account-details">
            <div className="input-box">
              <div className="input-title">Username</div>
              <input
                type="text"
                placeholder="Username"
                name="name"
                {...register("name", { required: true, minLength: 3 })}
              />
              {errors?.name?.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
              {errors?.name?.type === "minLength" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>
                  Min Length Should Be 3
                </div>
              )}
            </div>
            <div className="input-box">
              <div className="input-title">Email address</div>
              <input
                type="email"
                placeholder="name@exemple.com"
                name="email"
                {...register("email", { required: true })}
              />
              {errors?.email?.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
            </div>
            <div className="input-box">
              <div className="input-title">Phone number</div>
              <input
                type="number"
                placeholder="555-123-4567"
                name="email"
                {...register("phone", {
                  required: true,
                  minLength: 8,
                  maxLength: 12,
                })}
              />
              {errors?.phone?.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
              {errors?.phone?.type === "minLength" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  Min Length Should Be 9
                </div>
              )}
              {errors?.phone?.type === "maxLength" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  Max Length Should Be 13
                </div>
              )}
            </div>
            <button className="btn-prem">Save changes</button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Profile;

import React from "react";
import { BiError } from "react-icons/bi";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddMessageForm = ({ setShowMsg, setShowForm, setPage, setStopReq }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  });

  const handleData = (dataForm) => {
    const myObj = new FormData();
    myObj.append("title", dataForm.title);
    myObj.append("message", dataForm.message);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/AddMessage", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setShowMsg({ show: true, msg: data.data.msg, error: false });
            setShowForm(false);
            setPage(0);
            setStopReq(false);
            reset();
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit(handleData)}>
      <div className="title">Add notification</div>
      {/* title */}
      <div className="input-box">
        <div className="input-title">Title:</div>
        <input
          type="text"
          placeholder="Exemple"
          {...register("title", {
            required: true,
            minLength: 3,
            maxLength: 200,
          })}
        />
        {errors.title && errors.title.type === "required" && (
          <div className="validate">
            <div className="sym">
              <BiError />
            </div>{" "}
            This is Required
          </div>
        )}
        {errors.title && errors.title.type === "minLength" && (
          <div className="validate">
            <div className="sym">
              <BiError />
            </div>
            Min Length Should Be 3
          </div>
        )}

        {errors.title && errors.title.type === "maxLength" && (
          <div className="validate">
            <div className="sym">
              <BiError />
            </div>
            Max Length Should Be 200
          </div>
        )}
      </div>

      {/* Message */}
      <div className="input-box">
        <div className="input-title">Notification:</div>
        <textarea
          rows={8}
          type="text"
          placeholder="Add notification"
          {...register("message", { required: true, minLength: 5 })}
        />
        {errors.message && errors.message.type === "required" && (
          <div className="validate">
            <div className="sym">
              <BiError />
            </div>{" "}
            This is Required
          </div>
        )}
        {errors.message && errors.message.type === "minLength" && (
          <div className="validate">
            <div className="sym">
              <BiError />
            </div>
            Min Length Should Be 5
          </div>
        )}
      </div>
      <button className="btn-prem">Add message</button>
    </form>
  );
};

export default AddMessageForm;

import React, { useState, useEffect, useCallback } from "react";
import { BiError } from "react-icons/bi";
import { useForm } from "react-hook-form";
import axios from "axios";

const UpdateMessageForm = ({
  setShowMsg,
  setShowForm,
  setPage,
  setStopReq,
  messageId,
}) => {
  const [prevData, setPrevData] = useState(false);
  const [add, setAdd] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  });

  // get Prev Message
  const messageData = useCallback(() => {
    const myObj = new FormData();
    myObj.append("id", messageId);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/oneMessage", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setPrevData(data.data.message);
            const { message, title } = data.data.message;
            reset({
              title: title,
              message: message,
            });
          } else {
            // setShowMsg({ show: true, msg: data.data.msg, error: true })
            setShowForm(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [messageId]);

  useEffect(() => {
    messageData();
  }, [messageId, add]);

  // update Message function
  const handleData = (dataForm) => {
    const myObj = new FormData();
    const { id, title, message } = prevData;
    dataForm.title !== title && myObj.append("title", dataForm.title);
    dataForm.message !== message && myObj.append("message", dataForm.message);
    myObj.append("id", id);
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/updateMessageForm", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setShowMsg({ show: true, msg: data.data.msg, error: false });
            setShowForm(false);
            setPage(0);
            setStopReq(false);
            reset();
            setPrevData(false);
            setAdd((prev) => !prev);
          } else {
            setShowForm(false);
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {messageId && (
        <form className="message-form" onSubmit={handleSubmit(handleData)}>
          <div className="title">Update message</div>
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
            <div className="input-title">Message:</div>
            <textarea
              rows={8}
              type="text"
              placeholder="Add Message"
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
          <button className="btn-prem">Update message</button>
        </form>
      )}
    </>
  );
};

export default UpdateMessageForm;

import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdUpdate } from "react-icons/md";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";

const Message = ({
  message,
  messages,
  setMessages,
  index,
  setMessageId,
  setAddForm,
  setCheckboxArr,
  checkboxArr,
  setShowMsgConf,
  setShowForm,
  setShowMsg,
}) => {
  const { id, title, message: description, created_at, hidden } = message;
  const [plusDetail, setPlusDetail] = useState(false);

  // hidden message ////////////////////////////////////////
  const hidde = (id) => {
    const myObj = new FormData();
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    myObj.append("id", id);
    myObj.append("hidden", hidden ? 0 : 1);
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/updateMessage", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setShowMsg({ show: true, msg: data.data.msg, error: false });
            const myMessage = messages.find((message) => message.id === id);
            myMessage.hidden = hidden ? 0 : 1;
            setMessages(messages);
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const checkbox = (e) => {
    if (e.target.checked) {
      setCheckboxArr((prev) => [...prev, id]);
    } else {
      setCheckboxArr((prev) => prev.filter((elem) => elem !== id));
    }
  };

  return (
    <tr
      className={`${index % 2 > 0 && "cd"} ${hidden && "td-hidden"} ${
        checkboxArr.includes(id) && "checked"
      }`}
    >
      <td>
        <input
          className="checkbox"
          type="checkbox"
          onChange={checkbox}
          checked={checkboxArr.includes(id) ? true : false}
        />
      </td>
      <td>{index + 1}</td>
      <td>{title}</td>
      <td onClick={() => setPlusDetail(!plusDetail)}>
        {!plusDetail ? (
          <div>
            {description?.substring(0, 11)}
            <div className="plusText">...P</div>
          </div>
        ) : (
          description
        )}
      </td>
      <td>{created_at?.substring(0, 10)}</td>
      <td>
        <div
          className="update"
          style={{ color: "#f39d52" }}
          onClick={() => hidde(id)}
        >
          {!hidden ? (
            <BiHide className="update-in" />
          ) : (
            <BiShow className="update-in" />
          )}
        </div>
        <div
          onClick={() => {
            setMessageId(id);
            setShowMsgConf(true);
          }}
          className={`delete ${checkboxArr.length > 0 && "delete-in-hide"}`}
        >
          <AiOutlineDelete className="delete-in" />
        </div>
        <div
          className="update"
          onClick={() => {
            setMessageId(id);
            setShowForm(true);
            setAddForm(false);
          }}
        >
          <MdUpdate className="update-in" />
        </div>
      </td>
    </tr>
  );
};

export default Message;

import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";

const Contact = ({
  contact,
  contacts,
  setContacts,
  index,
  setContactId,
  setCheckboxArr,
  checkboxArr,
  setShowMsgConf,
  setShowMsg,
}) => {
  const { id, name, created_at, full_name, phone, message, email, hidden } =
    contact;
  const [plusDetail, setPlusDetail] = useState(false);

  // hidden contact ////////////////////////////////////////
  const hide = (id) => {
    const myObj = new FormData();
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    myObj.append("id", id);
    myObj.append("hidden", hidden ? 0 : 1);
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/updateContact", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setShowMsg({ show: true, msg: data.data.msg, error: false });
            const myContact = contacts.find((contact) => contact.id === id);
            myContact.hidden = hidden ? 0 : 1;
            setContacts(contacts);
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
      className={`${index % 2 > 0 && "cd"} ${
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
      <td>{name}</td>
      <td>{full_name}</td>
      <td>{email}</td>
      <td>0{phone}</td>
      <td onClick={() => setPlusDetail(!plusDetail)}>
        {!plusDetail ? (
          <div>
            {message.substring(0, 11)}
            <div className="plusText">...</div>
          </div>
        ) : (
          message
        )}
      </td>
      <td>{created_at.substring(0, 10)}</td>
      <td>
        <div className="update" onClick={() => hide(id)}>
          {!hidden ? (
            <BiHide className="update-in" />
          ) : (
            <BiShow className="update-in" />
          )}
        </div>
        <div
          onClick={() => {
            setContactId(id);
            setShowMsgConf(true);
          }}
          className={`delete ${checkboxArr.length > 0 && "delete-in-hide"}`}
        >
          <AiOutlineDelete className="delete-in" />
        </div>
      </td>
      {/* <td ><input type='checkbox' /></td> */}
    </tr>
  );
};

export default Contact;

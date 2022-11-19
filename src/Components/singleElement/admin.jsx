import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const Admin = ({
  admin,
  index,
  setShowMsgConf,
  setAdminId,
  setCheckboxArr,
  checkboxArr,
  setAdminName,
}) => {
  const { id, type, name, email, phone, image_name } = admin;
  const role = type === +process.env.REACT_APP_MODERATOR_KEY ? "Admin" : "Else";

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
      <td> {index + 1}</td>
      <td>
        <div className="img">
          <img
            src={`${process.env.REACT_APP_API_URL}Product/admin/${image_name}`}
            alt="img"
          />
        </div>
      </td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>{role}</td>
      <td>
        <div
          onClick={() => {
            setShowMsgConf(true);
            setAdminId(id);
            setAdminName(name);
          }}
          className={`delete ${checkboxArr.length > 0 && "delete-in-hide"}`}
        >
          <AiOutlineDelete className="delete-in" />
        </div>
      </td>
    </tr>
  );
};

export default Admin;

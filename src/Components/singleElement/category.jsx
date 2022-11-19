import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdUpdate } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";

const Category = ({
  category,
  index,
  setShowMsgConf,
  setCategoryId,
  setCheckboxArr,
  checkboxArr,
  setCategoryName,
}) => {
  const { id, name, description, active, image_name, products } = category;
  const [plusDescription, setPlusDescription] = useState(false);

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
      <td>
        <div className="img">
          <img
            src={`${process.env.REACT_APP_API_URL}Product/collection/${image_name}`}
            alt="img"
          />
        </div>
      </td>
      <td>{name}</td>
      <td onClick={() => setPlusDescription(!plusDescription)}>
        {!plusDescription ? (
          <div>
            {description.substring(0, 11)}
            <div className="plusText">...</div>
          </div>
        ) : (
          description
        )}
      </td>
      <td>{products?.length}</td>
      <td className="sym">{active ? <FcOk /> : <FcCancel />} </td>
      <td>
        <div
          onClick={() => {
            setShowMsgConf(true);
            setCategoryId(id);
            setCategoryName(name);
          }}
          className={`delete ${checkboxArr.length > 0 && "delete-in-hide"}`}
        >
          <AiOutlineDelete className="delete-in" />
        </div>
        <Link to={`update/${id}`} className="update">
          <MdUpdate className="update-in" />
        </Link>
      </td>
    </tr>
  );
};

export default Category;

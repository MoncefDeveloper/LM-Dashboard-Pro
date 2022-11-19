import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdUpdate } from "react-icons/md";
import { AiOutlineDelete, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { FcOk, FcCancel } from "react-icons/fc";

const Product = ({
  product,
  index,
  setShowMsgConf,
  setProductId,
  setCheckboxArr,
  checkboxArr,
  setProductName,
}) => {
  const [plusDetail, setPlusDetail] = useState(false);
  const [plusDescription, setPlusDescription] = useState(false);
  const {
    id,
    name,
    price,
    description,
    images_count,
    details,
    category,
    role,
    active,
    image_name,
    back_image_name,
    trend,
  } = product;

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
      } `}
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
            src={`${process.env.REACT_APP_API_URL}Product/watchs/${image_name}`}
            alt="img"
          />
        </div>
      </td>
      <td>
        <div className="img">
          <img
            src={`${process.env.REACT_APP_API_URL}Product/watchs/${back_image_name}`}
            alt="img"
          />
        </div>
      </td>
      <td>{name}</td>
      <td>{price}</td>
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
      <td onClick={() => setPlusDetail(!plusDetail)}>
        {!plusDetail ? (
          <div>
            {details.substring(0, 11)}
            <div className="plusText">...</div>
          </div>
        ) : (
          details
        )}
      </td>
      <td>{category.name}</td>
      <td>{role}</td>
      <td>
        <Link to={`pictures/${id}`} style={{ width: "100%" }}>
          <div className="count">{images_count}</div>
        </Link>
      </td>
      <td className="sym">{active ? <FcOk /> : <FcCancel />} </td>
      <td className="star">{trend ? <AiFillStar /> : <AiOutlineStar />} </td>
      <td>
        <div
          onClick={() => {
            setShowMsgConf(true);
            setProductId(id);
            setProductName(name);
          }}
          className={`delete ${checkboxArr.length > 0 && "delete-in-hide"}`}
        >
          <AiOutlineDelete className="delete-in" />
        </div>
        <Link to={`update/${id}`} className="update">
          <MdUpdate className="update-in" />
        </Link>
        <Link to={`addPicture/${id}`} className="add">
          <BiImageAdd className="add-in" />
        </Link>
      </td>
    </tr>
  );
};

export default Product;

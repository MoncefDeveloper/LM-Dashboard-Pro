import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const User = ({ user, index, setUserId, setCheckboxArr, checkboxArr, setShowMsgConf }) => {
  const { id, name, created_at, last_seen, full_name, adress, email } = user;

  const checkbox = (e) => {
    if (e.target.checked) {
      setCheckboxArr(prev => [...prev, id]);
    } else {
      setCheckboxArr(prev => prev.filter(elem => elem !== id));
    }
  }



  return (
    <tr className={`${index % 2 > 0 && 'cd'} ${checkboxArr.includes(id) && 'checked'}`}  >
      <td>
        <input className="checkbox" type='checkbox' onChange={checkbox} checked={checkboxArr.includes(id) ? true : false} />
      </td>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{full_name}</td>
      <td>{adress}</td>
      <td>{email}</td>
      <td>
        <div className="last_seen">
          {last_seen}
        </div>
      </td>
      <td>{created_at.substring(0, 10)}</td>
      <td>
        <div onClick={() => { setUserId(id); setShowMsgConf(true) }}
          className={`delete ${checkboxArr.length > 0 && 'delete-in-hide'}`}>
          <AiOutlineDelete className='delete-in' />
        </div>
      </td>
      {/* <td ><input type='checkbox' /></td> */}
    </tr>
  );
}

export default User;

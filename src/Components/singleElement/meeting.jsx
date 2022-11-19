import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import axios from "axios";

const Meeting = ({
  meeting,
  meetings,
  setMeetings,
  index,
  setMeetingId,
  setCheckboxArr,
  checkboxArr,
  setShowMsgConf,
  setShowMsg,
}) => {
  const { id, name, created_at, comment, phone, date, houre, email, hidden } =
    meeting;
  const [plusDetail, setPlusDetail] = useState(false);

  // hidden meeting
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
        .post(process.env.REACT_APP_API_URL + "api/updateMeeting", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setShowMsg({ show: true, msg: data.data.msg, error: false });
            const myMeeting = meetings.find((meeting) => meeting.id === id);
            myMeeting.hidden = hidden ? 0 : 1;
            setMeetings(meetings);
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
      <td>{name}</td>
      <td>{email}</td>
      <td>0{phone}</td>
      <td>{date}</td>
      <td>
        {houre.substring(0, 5)}-{parseInt(houre.substring(0, 2)) + 1}:00
      </td>
      <td onClick={() => setPlusDetail(!plusDetail)}>
        {!plusDetail ? (
          <div>
            {comment.substring(0, 11)}
            <div className="plusText">...</div>
          </div>
        ) : (
          comment
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
            setMeetingId(id);
            setShowMsgConf(true);
          }}
          className={`delete ${checkboxArr.length > 0 && "delete-in-hide"}`}
        >
          <AiOutlineDelete className="delete-in" />
        </div>
      </td>
    </tr>
  );
};

export default Meeting;

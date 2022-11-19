import React, { useState, useEffect } from "react";
import "./../../pages/tasks/tasks.css";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";

const Task = ({
  task,
  changeType,
  renderTasks,
  setRenderTasks,
  setShowMsg,
}) => {
  const [showSelect, setShowSelect] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [description, setDescription] = useState(task?.description);

  // Update Task
  const update = () => {
    if (description && description !== task?.description) {
      const myObj = new FormData();
      const url = process.env.REACT_APP_API_URL + "api/updateTask";
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("description", description);
      myObj.append("id", task?.id);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setRenderTasks(!renderTasks);
            setIsUpdate(false);
            setShowMsg({ show: true, msg: data.data.msg, error: false });
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    setIsUpdate(false);
  };

  // update desction input
  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);

  // Drop Task
  const drop = () => {
    const myObj = new FormData();
    const url = process.env.REACT_APP_API_URL + "api/dropTask";
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    myObj.append("id", task?.id);
    try {
      axios.post(url, myObj, { withCredentials: true }).then((data) => {
        if (data.data.status) {
          setRenderTasks(!renderTasks);
          setShowMsg({ show: true, msg: data.data.msg, error: false });
          setIsUpdate(false);
        } else {
          setShowMsg({ show: true, msg: data.data.msg, error: true });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="task"
      onClick={(e) => {
        const valid =
          e.target?.tagName !== "svg" &&
          e.target?.tagName !== "path" &&
          e.target?.classList.value !== "update-sym" &&
          e.target?.classList.value !== "option";
        valid && setIsUpdate(true);
        valid && setShowSelect(false);
      }}
    >
      {isUpdate ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            name="update"
            rows="4"
            // onBlur={() => (setIsUpdate(false),setDescription(task?.description))}
            onKeyDown={(e) =>
              e.key === "Escape" &&
              (setIsUpdate(false), setDescription(task?.description))
            }
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            onFocus={(e) => (e.target.value = description)}
            autoFocus
          />
          <div className="update" onClick={update}>
            <IoMdCheckmarkCircleOutline />
          </div>
          <div
            className="update update-cancel"
            onClick={() => {
              setIsUpdate(false);
              setDescription(task?.description);
            }}
          >
            <MdOutlineCancel />
          </div>
        </form>
      ) : (
        <>
          <button
            onFocus={() => setShowSelect(true)}
            onBlur={() => setShowSelect(false)}
            className="update-sym"
          >
            <HiOutlinePencilAlt />
            <div className={`select ${showSelect && "select-show"}`}>
              <div
                onClick={() => changeType(task?.id, "todo")}
                className="option"
              >
                To Do
              </div>
              <div
                onClick={() => changeType(task?.id, "doing")}
                className="option"
              >
                Doing
              </div>
              <div
                onClick={() => changeType(task?.id, "done")}
                className="option"
              >
                Done
              </div>
              <div onClick={drop} className="option option-denger">
                Drop
              </div>
            </div>
          </button>
          <div className="top">
            <div className="text">{task?.description}</div>
          </div>
          <div className="bottom">
            <div className="left">{task?.created_at?.substring(0, 10)}</div>
            <div className="right">
              <img
                src={
                  process.env.REACT_APP_API_URL +
                  `Product/admin/${task?.admin?.image_name}`
                }
                alt="img"
              />
              {/* <img src={img} alt="img" /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;

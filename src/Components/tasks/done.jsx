import React, { useState } from "react";
import "./../../pages/tasks/tasks.css";
import { BiLayerPlus } from "react-icons/bi";
import Task from "./task";
import axios from "axios";
import { useGlobalContext } from "../../context/context";

const Done = ({ tasks, renderTasks, setRenderTasks, setShowMsg }) => {
  const [todo, setTodo] = useState(false);
  const [description, setDescription] = useState("");
  const { admin } = useGlobalContext();

  const addTask = (e) => {
    e.preventDefault();
    if (description) {
      const myObj = new FormData();
      const url = process.env.REACT_APP_API_URL + "api/AddTask";
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("description", description);
      myObj.append("type", "done");
      myObj.append("admin_id", admin?.id);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setRenderTasks(!renderTasks);
            setShowMsg({ show: true, msg: data.data.msg, error: false });
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    setTodo(false);
    setDescription("");
  };

  const changeType = (id, type) => {
    const arr = ["todo", "doing", "done"];
    if (arr.includes(type)) {
      const myObj = new FormData();
      const url = process.env.REACT_APP_API_URL + "api/updateTask";
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("type", type);
      myObj.append("id", id);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setRenderTasks(!renderTasks);
            setShowMsg({ show: true, msg: data.data.msg, error: false });
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="box">
      <div className="head">
        Done
        <div className="count">{tasks?.length}</div>
      </div>
      <div className="box-content">
        {tasks?.map((task, key) => {
          return (
            <Task
              renderTasks={renderTasks}
              setRenderTasks={setRenderTasks}
              setShowMsg={setShowMsg}
              task={task}
              changeType={changeType}
              key={key}
            />
          );
        })}
      </div>
      <div className="foot">
        {todo ? (
          <form onSubmit={addTask} className="add-form">
            <input
              autoFocus
              value={description}
              onKeyDown={(e) =>
                e.key === "Escape" && (setTodo(false), setDescription(""))
              }
              onBlur={() => {
                setTodo(false);
                setDescription("");
              }}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="New task"
            />
          </form>
        ) : (
          <div className="left" onClick={() => setTodo(true)}>
            <div className="sym-plus">
              <BiLayerPlus />
            </div>{" "}
            Add new cart
          </div>
        )}
      </div>
    </div>
  );
};

export default Done;

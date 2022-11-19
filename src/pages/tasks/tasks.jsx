import React, { useState, useEffect } from "react";
import "./tasks.css";
import Todo from "../../Components/tasks/todo";
import Doing from "../../Components/tasks/doing";
import Done from "../../Components/tasks/done";
import { BiError } from "react-icons/bi";
import axios from "axios";
import Loader from "../../Components/loader/loader";

const Tasks = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [renderTasks, setRenderTasks] = useState(false);
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stopReq, setStopReq] = useState(false);

  useEffect(() => {
    const getTasks = () => {
      const myObj = new FormData();
      const url = process.env.REACT_APP_API_URL + "api/tasks";
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      if (!stopReq) {
        try {
          axios.post(url, myObj, { withCredentials: true }).then((data) => {
            if (data.data.status) {
              setTodoTasks([
                ...data.data.tasks.filter((task) => task.type === "todo"),
              ]);
              setDoingTasks([
                ...data.data.tasks.filter((task) => task.type === "doing"),
              ]);
              setDoneTasks([
                ...data.data.tasks.filter((task) => task.type === "done"),
              ]);
            } else {
              setShowMsg({ show: true, msg: data.data.msg, error: true });
              setStopReq(true);
            }
            setIsLoading(false);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    getTasks();

    //  this return stop warning of (
    //  perform a React state update on an unmounted component.
    //  This is a no - op, but it indicates a memory leak in your application.
    //  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // )
    return () => {
      setTodoTasks((prev) => [...prev]);
      setDoingTasks((prev) => [...prev]);
      setDoneTasks((prev) => [...prev]);
    };
  }, [renderTasks, stopReq]);

  // hidden the error msg
  useEffect(() => {
    let hiddenMsg = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, 5000);
    return () => clearTimeout(hiddenMsg);
  }, [showMsg]);

  return (
    <section className="tasks">
      <div
        className={`msg-box ${showMsg.show && "msg-box-show"} ${
          showMsg.error && "msg-box-error"
        }`}
      >
        {showMsg.error && (
          <div className="sym">
            <BiError />
          </div>
        )}
        {showMsg.msg}
      </div>
      <div className="header">
        <div className="intro">
          <div className="title">TASKS</div>
          <div className="text">
            Create a new task and let the others do it for you....
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="big-box">
          <Todo
            tasks={todoTasks}
            renderTasks={renderTasks}
            setRenderTasks={setRenderTasks}
            setShowMsg={setShowMsg}
          />
          <Doing
            tasks={doingTasks}
            renderTasks={renderTasks}
            setRenderTasks={setRenderTasks}
            setShowMsg={setShowMsg}
          />
          <Done
            tasks={doneTasks}
            renderTasks={renderTasks}
            setRenderTasks={setRenderTasks}
            setShowMsg={setShowMsg}
          />
        </div>
      )}
    </section>
  );
};
const Loading = () => {
  return (
    <div className="loader-2">
      <Loader />
    </div>
  );
};

export default Tasks;

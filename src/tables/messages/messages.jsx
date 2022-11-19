import React, { useState, useEffect } from "react";
import { AiFillNotification } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import {
  BsSortNumericDownAlt,
  BsSortNumericDown,
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
} from "react-icons/bs";
import "../tables.css";
import "./messages.css";
import axios from "axios";
import Loader from "../../Components/loader/loader";
import { useGlobalContext } from "../../context/context";
import Message from "../../Components/singleElement/message";
import AddMessageForm from "../../Components/forms/message-add-form";
import UpdateMessageForm from "../../Components/forms/message-update-form";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [searchMessage, setSearchMessage] = useState([]);
  const [links, setLinks] = useState(1);
  const [page, setPage] = useState(0);
  const [iSsortSymNum, setISsortSymNum] = useState(true);
  const [sortName, setSortName] = useState("Time");
  const [desc_asc, setDesc_asc] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showMsgConf, setShowMsgConf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const [checkboxArr, setCheckboxArr] = useState([]);

  const [stopReq, setStopReq] = useState(false);
  const { isHeInBottom } = useGlobalContext();
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });

  // Get Messages
  useEffect(() => {
    const getMessages = () => {
      const url =
        process.env.REACT_APP_API_URL + "api/getMessages?page=" + page;
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      if (!stopReq) {
        try {
          axios.post(url, myObj, { withCredentials: true }).then((data) => {
            setIsLoading(false);
            if (data?.data?.status) {
              setMessages((prev) => [
                ...new Map(
                  [...prev, ...data.data.messages.data].map((item) => [
                    item.id,
                    item,
                  ])
                ).values(),
              ]);
              setLinks(data.data.messages.links.length);
              data.data.messages.to === data.data.messages.total &&
                setStopReq(true);
            } else {
              setShowMsg({
                ...showMsg,
                show: true,
                msg: data.data.msg,
                error: true,
              });
              setStopReq(true);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMessages();
    //  this return stop warning of (
    //  perform a React state update on an unmounted component.
    //  This is a no - op, but it indicates a memory leak in your application.
    //  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // )
    return () => setMessages((prev) => [...prev]);
  }, [page, showMsg, stopReq]);

  //order function
  const sort_by = (field, reverse, primer) => {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };
  const order = (
    sortName,
    orderBy,
    isNumber = false,
    direction = !desc_asc
  ) => {
    setISsortSymNum(isNumber ? true : false);
    setSortName(sortName);
    setDesc_asc(direction);
    const newMessages = (
      isSearching
        ? searchMessage
        : messages.filter((message) => !message.hidden)
    ).sort(
      sort_by(orderBy, desc_asc, (a) =>
        isNumber ? parseInt(a) : a.toUpperCase()
      )
    );
    isSearching ? setSearchMessage(newMessages) : setMessages(newMessages);
  };

  // Search Fucntion
  const handleSearch = (e) => {
    const SearchValue = e.target.value;
    if (SearchValue && !showMsg.error) {
      setIsSearching(true);
      const url = process.env.REACT_APP_API_URL + "api/searchMessage";
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("name", e.target.value);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setSearchMessage(
              data.data.messages.filter((message) => !message.hidden)
            );
          } else {
            setShowMsg({
              ...showMsg,
              show: true,
              msg: data.data.msg,
              error: true,
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsSearching(false);
      setSearchMessage([]);
    }
  };

  // hidden the error msg
  useEffect(() => {
    let hiddenMsg = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, 5000);
    return () => clearTimeout(hiddenMsg);
  }, [showMsg]);

  // loading page
  useEffect(() => {
    if (isHeInBottom) {
      setPage((prev) =>
        prev !== links - 2 || (prev !== links - 2 && !isSearching)
          ? prev + 1
          : prev
      );
    }
  }, [isHeInBottom, links, isSearching]);

  // drop Message
  const dropMessage = () => {
    if (messageId) {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", messageId);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropMessage", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setMessages(
                messages.filter((message) => message.id !== messageId)
              );
              setShowMsg({
                ...showMsg,
                show: true,
                msg: data.data.msg,
                error: false,
              });
            } else {
              setShowMsg({
                ...showMsg,
                show: true,
                msg: data.data.msg,
                error: true,
              });
            }
            setShowMsgConf(false);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // delete select messages
  const dropMessages = () => {
    if (checkboxArr.length > 0) {
      try {
        const myObj = new FormData();
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        myObj.append("ids", checkboxArr);
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropMessages", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setMessages(
                messages.filter((message) => !checkboxArr.includes(message.id))
              );
              setShowMsg({
                ...showMsg,
                show: true,
                msg: data.data.msg,
                error: false,
              });
              setCheckboxArr([]);
            } else {
              setShowMsg({
                ...showMsg,
                show: true,
                msg: data.data.msg,
                error: true,
              });
            }
            setShowMsgConf(false);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <section
        className={`msg-form-background ${
          showForm && "msg-form-background-show"
        }`}
        onClick={(e) =>
          e.target.classList[0] === "msg-form-background" && setShowForm(false)
        }
      >
        {addForm ? (
          <AddMessageForm
            setShowMsg={setShowMsg}
            setShowForm={setShowForm}
            setPage={setPage}
            setStopReq={setStopReq}
          />
        ) : (
          <UpdateMessageForm
            setShowMsg={setShowMsg}
            setShowForm={setShowForm}
            setPage={setPage}
            setStopReq={setStopReq}
            messageId={messageId}
          />
        )}
      </section>
      <section className="tables">
        <div
          className={`msg-box ${showMsg.show && "msg-box-show"} ${
            showMsg.error && "msg-box-error"
          }`}
        >
          {" "}
          {showMsg.error && (
            <div className="sym">
              <BiError />
            </div>
          )}{" "}
          {showMsg.msg}
        </div>
        <div
          className={`msg-box msg-box-error msg-center ${
            showMsgConf && "msg-center-show"
          }`}
        >
          <div className="msg-conf">
            <div className="sym">
              <BiError />
            </div>
            <div className="text">
              Are you sure you want to make this operation ?
            </div>
            <div className="icons">
              <div
                className="icon-cancel"
                onClick={() => {
                  setShowMsgConf(false);
                  setCheckboxArr([]);
                }}
              >
                No
              </div>
              <div
                className="icon-complete"
                onClick={() =>
                  checkboxArr.length > 0 ? dropMessages() : dropMessage()
                }
              >
                Yes
              </div>
            </div>
          </div>{" "}
        </div>
        <header className="header">
          <div className="intro">
            <div className="sym">
              <AiFillNotification />
            </div>
            <div className="title">Notifications</div>
            <button
              onClick={() => {
                setShowForm(true);
                setAddForm(true);
              }}
              className="add-btn"
            >
              <div to="add">+</div>
            </button>
          </div>
          <div className="text">
            An extension of the Simple DataTables library, customized for LM
            Dashboard Pro
          </div>
        </header>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="big-box">
            <div className="options">
              <div className="left">
                <div className="sortBox">{sortName}</div>
                <div className="sym">
                  {!desc_asc ? (
                    iSsortSymNum ? (
                      <BsSortNumericDownAlt />
                    ) : (
                      <BsSortAlphaDownAlt />
                    )
                  ) : iSsortSymNum ? (
                    <BsSortNumericDown />
                  ) : (
                    <BsSortAlphaDown />
                  )}
                </div>
              </div>
              <div className="center buttons">
                <div
                  onClick={() => {
                    setShowForm(true);
                    setAddForm(true);
                  }}
                  className="btn-prem add-btn"
                >
                  Add
                </div>
                <div
                  className={`dlt-btn ${
                    !checkboxArr.length > 0 && "dlt-btn-hide"
                  }`}
                  onClick={() => setShowMsgConf(true)}
                >
                  Delete
                </div>
              </div>
              <div className="right">
                <div className="form">
                  <input
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
            <div className="table">
              <table>
                <tbody>
                  <tr>
                    <th className="checkbox"></th>
                    <th>ID </th>
                    <th onClick={() => order("Title", "title")}>
                      Title{" "}
                      <div className="sym">
                        <FaSort />
                      </div>
                    </th>
                    <th onClick={() => order("Notification", "message")}>
                      Notification{" "}
                      <div className="sym">
                        <FaSort />
                      </div>
                    </th>
                    <th onClick={() => order("Time", "id", true)}>
                      Time{" "}
                      <div className="sym">
                        <FaSort />
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                  {(isSearching && searchMessage
                    ? searchMessage
                    : messages
                  ).map((message, index) => {
                    return (
                      <Message
                        message={message}
                        messages={messages}
                        setMessages={setMessages}
                        index={index}
                        setShowMsgConf={setShowMsgConf}
                        setShowMsg={setShowMsg}
                        setCheckboxArr={setCheckboxArr}
                        checkboxArr={checkboxArr}
                        setMessageId={setMessageId}
                        key={index}
                        setShowForm={setShowForm}
                        setAddForm={setAddForm}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {
          <div className="pgnt-loader">
            {isHeInBottom &&
              !stopReq &&
              page !== links - 2 &&
              !isLoading &&
              !isSearching &&
              !showMsg.error && (
                <div className="mini-loader">
                  <Loader />
                </div>
              )}
          </div>
        }
      </section>
    </>
  );
};

const Loading = () => {
  return (
    <div className="loader-2">
      <Loader />
    </div>
  );
};
export default Messages;

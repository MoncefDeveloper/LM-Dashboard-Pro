import React, { useState, useEffect } from "react";
import { FaSort, FaUsers } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import {
  BsSortNumericDownAlt,
  BsSortNumericDown,
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
} from "react-icons/bs";
import "../tables.css";
import "./users.css";
import axios from "axios";
import Loader from "../../Components/loader/loader";
import { useGlobalContext } from "../../context/context";
import User from "../../Components/singleElement/user";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [links, setLinks] = useState(1);
  const [page, setPage] = useState(0);
  const [iSsortSymNum, setISsortSymNum] = useState(true);
  const [sortName, setSortName] = useState("Time");
  const [desc_asc, setDesc_asc] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showMsgConf, setShowMsgConf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(0);
  const [checkboxArr, setCheckboxArr] = useState([]);
  const [stopReq, setStopReq] = useState(false);
  const { isHeInBottom } = useGlobalContext();
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });

  // Get Users
  useEffect(() => {
    const getUsers = () => {
      const url = process.env.REACT_APP_API_URL + "api/getUsers?page=" + page;
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      if (!stopReq) {
        try {
          axios.post(url, myObj, { withCredentials: true }).then((data) => {
            setIsLoading(false);
            if (data.data.status) {
              setUsers((prev) => [
                ...new Map(
                  [...prev, ...data.data.users.data].map((item) => [
                    item.id,
                    item,
                  ])
                ).values(),
              ]);
              setLinks(data.data.users.links.length);
              data.data.users.to === data.data.users.total && setStopReq(true);
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
    getUsers();
    //  this return stop warning of (
    //  perform a React state update on an unmounted component.
    //  This is a no - op, but it indicates a memory leak in your application.
    //  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // )
    return () => setUsers((prev) => [...prev]);
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
    const newUsers = (
      isSearching ? searchUser : users.filter((user) => !user.hidden)
    ).sort(
      sort_by(orderBy, desc_asc, (a) =>
        isNumber ? parseInt(a) : a.toUpperCase()
      )
    );
    isSearching ? setSearchUser(newUsers) : setUsers(newUsers);
  };

  // Search Fucntion
  const handleSearch = (e) => {
    const SearchValue = e.target.value;
    if (SearchValue && !showMsg.error) {
      setIsSearching(true);
      const url = process.env.REACT_APP_API_URL + "api/searchUsers";
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("name", e.target.value);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setSearchUser(data.data.users.filter((user) => !user.hidden));
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
      setSearchUser([]);
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

  // drop User
  const dropUser = () => {
    if (userId) {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", userId);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropUser", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setUsers(users.filter((user) => user.id !== userId));
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

  // delete select users
  const dropUsers = () => {
    if (checkboxArr.length > 0) {
      try {
        const myObj = new FormData();
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        myObj.append("ids", checkboxArr);
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropUsers", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setUsers(users.filter((user) => !checkboxArr.includes(user.id)));
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
                checkboxArr.length > 0 ? dropUsers() : dropUser()
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
            <FaUsers />
          </div>
          <div className="title">Users</div>
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
                  <th onClick={() => order("Name", "name")}>
                    Name{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("Full n ame", "full_name")}>
                    Full-Name{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("Adress", "adress")}>
                    Adress{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("email", "email")}>
                    Email{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("Last seen", "last_seen", true)}>
                    Last seen{" "}
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
                {(isSearching && searchUser ? searchUser : users).map(
                  (user, index) => {
                    return (
                      <User
                        user={user}
                        setCheckboxArr={setCheckboxArr}
                        checkboxArr={checkboxArr}
                        index={index}
                        setShowMsgConf={setShowMsgConf}
                        setUserId={setUserId}
                        key={index}
                      />
                    );
                  }
                )}
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
            !showMsg.error && <Loader />}{" "}
        </div>
      }
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
export default Users;

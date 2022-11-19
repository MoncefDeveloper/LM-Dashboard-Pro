import React, { useState, useEffect } from "react";
import { BiTable } from "react-icons/bi";
import { FaSort } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import {
  BsSortNumericDownAlt,
  BsSortNumericDown,
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
} from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";
import "../tables.css";
import "./admins.css";
import axios from "axios";
import Loader from "../../Components/loader/loader";
import Admin from "../../Components/singleElement/admin";

const Admins = () => {
  const [admins, setadmins] = useState([]);
  const [searchAdmins, setSearchAdmins] = useState([]);
  const [iSsortSymNum, setISsortSymNum] = useState(true);
  const [sortName, setSortName] = useState("Time");
  const [desc_asc, setDesc_asc] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMsgConf, setShowMsgConf] = useState(false);
  const [adminId, setAdminId] = useState(0);
  const [checkboxArr, setCheckboxArr] = useState([]);
  const [adminName, setadminName] = useState("");
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });

  // Get Admins
  useEffect(() => {
    const getAdmins = () => {
      const url = process.env.REACT_APP_API_URL + "api/getAdmins";
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          setIsLoading(false);
          if (data.data.status) {
            setadmins(data.data.admins);
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getAdmins();
  }, []);

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
    const newadmins = (isSearching ? searchAdmins : admins).sort(
      sort_by(orderBy, desc_asc, (a) =>
        isNumber ? parseInt(a) : a.toUpperCase()
      )
    );
    isSearching ? setSearchAdmins(newadmins) : setadmins(newadmins);
  };

  // Search Fucntion
  const handleSearch = (e) => {
    const SearchValue = e.target.value;
    if (SearchValue && !showMsg.error) {
      setIsSearching(true);
      const url = process.env.REACT_APP_API_URL + "searchAdmins";
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("name", e.target.value);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setSearchAdmins(data.data.admins);
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
      setSearchAdmins([]);
    }
  };

  // hidden the error msg
  useEffect(() => {
    let hiddenMsg = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, 5000);
    return () => clearTimeout(hiddenMsg);
  }, [showMsg]);

  //drop admin
  const dropAdmin = () => {
    if (adminId) {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", adminId);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropAdmin", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setadmins(admins.filter((admin) => admin.id !== adminId));
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
            setAdminId(0);
            setadminName("");
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // delete select admins
  const dropAdmins = () => {
    if (checkboxArr.length > 0) {
      try {
        const myObj = new FormData();
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        myObj.append("ids", checkboxArr);
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropAdmins", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setadmins(
                admins.filter((admin) => !checkboxArr.includes(admin.id))
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
            Are you sure you want to delete "{adminName}" ? That operation make
            you drop all Tasks related with "{adminName}"
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
                checkboxArr.length > 0 ? dropAdmins() : dropAdmin()
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
            <BiTable />
          </div>
          <div className="title">Admins</div>
          <button className="add-btn">
            <Link to="add">+</Link>
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
              <NavLink to={"add"} className="btn-prem add-btn">
                Add
              </NavLink>
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
                  <th onClick={() => order("Time", "id", true)}>
                    ID{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th>Image</th>
                  <th onClick={() => order("Name", "name")}>
                    Name{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("Email", "email")}>
                    Email{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("Phone", "phone", true)}>
                    Phone{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th onClick={() => order("Type", "type", true)}>
                    Type{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th>Actions</th>
                  {/* <th className="all" >All</th> */}
                </tr>
                {(isSearching && searchAdmins ? searchAdmins : admins).map(
                  (admin, index) => {
                    return (
                      <Admin
                        admin={admin}
                        index={index}
                        setCheckboxArr={setCheckboxArr}
                        checkboxArr={checkboxArr}
                        key={index}
                        setAdminId={setAdminId}
                        setShowMsgConf={setShowMsgConf}
                        setAdminName={setadminName}
                      />
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
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
export default Admins;

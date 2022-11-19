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
import "./categories.css";
import axios from "axios";
import Loader from "../../Components/loader/loader";
import { useGlobalContext } from "../../context/context";
import Category from "../../Components/singleElement/category";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchCategories, setSearchCategories] = useState([]);
  const [links, setLinks] = useState(1);
  const [page, setPage] = useState(0);
  const [iSsortSymNum, setISsortSymNum] = useState(true);
  const [sortName, setSortName] = useState("Time");
  const [desc_asc, setDesc_asc] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isHeInBottom } = useGlobalContext();
  const [showMsgConf, setShowMsgConf] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [checkboxArr, setCheckboxArr] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [stopReq, setStopReq] = useState(false);
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });

  // Get Categories
  useEffect(() => {
    const getCategories = () => {
      const url =
        process.env.REACT_APP_API_URL + "api/getCategoriesAll?page=" + page;
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
              setCategories((prev) => [
                ...new Map(
                  [...prev, ...data.data.categories.data].map((item) => [
                    item.id,
                    item,
                  ])
                ).values(),
              ]);
              setLinks(data.data.categories.links.length);
              data.data.categories.to === data.data.categories.total &&
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
    getCategories();
    //  this return stop warning of (
    //  perform a React state update on an unmounted component.
    //  This is a no - op, but it indicates a memory leak in your application.
    //  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // )
    return () => setCategories((prev) => [...prev]);
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
    const newCategories = (isSearching ? searchCategories : categories).sort(
      sort_by(orderBy, desc_asc, (a) =>
        isNumber ? parseInt(a) : a.toUpperCase()
      )
    );
    isSearching
      ? setSearchCategories(newCategories)
      : setCategories(newCategories);
  };

  // Search Fucntion
  const handleSearch = (e) => {
    const SearchValue = e.target.value;
    if (SearchValue && !showMsg.error) {
      setIsSearching(true);
      const url = process.env.REACT_APP_API_URL + "api/searchCategories";
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("name", e.target.value);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setSearchCategories(data.data.categories);
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
      setSearchCategories([]);
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

  //drop category
  const dropCategory = () => {
    if (categoryId) {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", categoryId);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropCategory", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setCategories(
                categories.filter((category) => category.id !== categoryId)
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
            setCategoryId(0);
            setCategoryName("");
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // delete select categories
  const dropCategories = () => {
    if (checkboxArr.length > 0) {
      try {
        const myObj = new FormData();
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        myObj.append("ids", checkboxArr);
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropCategories", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setCategories(
                categories.filter(
                  (category) => !checkboxArr.includes(category.id)
                )
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
            Are you sure you want to delete "{categoryName}" ? That operation
            make you drop all products all related with "{categoryName}"
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
                checkboxArr.length > 0 ? dropCategories() : dropCategory()
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
          <div className="title">Categories</div>
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
                  <th onClick={() => order("Description", "description")}>
                    Description{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th>Products </th>
                  <th onClick={() => order("Active", "active", true)}>
                    Active{" "}
                    <div className="sym">
                      <FaSort />
                    </div>
                  </th>
                  <th>Actions</th>
                  {/* <th className="all" >All</th> */}
                </tr>
                {(isSearching && searchCategories
                  ? searchCategories
                  : categories
                ).map((category, index) => {
                  return (
                    <Category
                      category={category}
                      index={index}
                      key={index}
                      setCheckboxArr={setCheckboxArr}
                      checkboxArr={checkboxArr}
                      setCategoryId={setCategoryId}
                      setShowMsgConf={setShowMsgConf}
                      setCategoryName={setCategoryName}
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
export default Categories;

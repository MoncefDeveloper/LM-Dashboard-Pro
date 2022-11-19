import React, { useState, useEffect } from "react";
import { MdPermContactCalendar } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import {
  BsSortNumericDownAlt,
  BsSortNumericDown,
  BsSortAlphaDownAlt,
  BsSortAlphaDown,
} from "react-icons/bs";
import "../tables.css";
import "./contacts.css";
import axios from "axios";
import Loader from "../../Components/loader/loader";
import { useGlobalContext } from "../../context/context";
import Contact from "../../Components/singleElement/contact";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchContact, setSearchContact] = useState([]);
  const [links, setLinks] = useState(1);
  const [page, setPage] = useState(0);
  const [iSsortSymNum, setISsortSymNum] = useState(true);
  const [sortName, setSortName] = useState("Time");
  const [desc_asc, setDesc_asc] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showMsgConf, setShowMsgConf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactId, setContactId] = useState(0);
  const [checkboxArr, setCheckboxArr] = useState([]);
  const [stopReq, setStopReq] = useState(false);
  const { isHeInBottom } = useGlobalContext();
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });

  // Get Contacts
  useEffect(() => {
    const getContacts = () => {
      const url =
        process.env.REACT_APP_API_URL + "api/getContacts?page=" + page;
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
              setContacts((prev) => [
                ...new Map(
                  [...prev, ...data.data.contacts.data].map((item) => [
                    item.id,
                    item,
                  ])
                ).values(),
              ]);
              setLinks(data.data.contacts.links.length);
              data.data.contacts.to === data.data.contacts.total &&
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
    getContacts();
    //  this return stop warning of (
    //  perform a React state update on an unmounted component.
    //  This is a no - op, but it indicates a memory leak in your application.
    //  To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // )
    return () => setContacts((prev) => [...prev]);
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
    const newContacts = (
      isSearching
        ? searchContact
        : contacts.filter((contact) => !contact.hidden)
    ).sort(
      sort_by(orderBy, desc_asc, (a) =>
        isNumber ? parseInt(a) : a.toUpperCase()
      )
    );
    isSearching ? setSearchContact(newContacts) : setContacts(newContacts);
  };

  // Search Fucntion
  const handleSearch = (e) => {
    const SearchValue = e.target.value;
    if (SearchValue && !showMsg.error) {
      setIsSearching(true);
      const url = process.env.REACT_APP_API_URL + "api/searchContact";
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("name", e.target.value);
      try {
        axios.post(url, myObj, { withCredentials: true }).then((data) => {
          if (data.data.status) {
            setSearchContact(
              data.data.contacts.filter((contact) => !contact.hidden)
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
      setSearchContact([]);
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

  // drop Contact
  const dropContact = () => {
    if (contactId) {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", contactId);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropContact", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setContacts(
                contacts.filter((contact) => contact.id !== contactId)
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

  // delete select contacts
  const dropContacts = () => {
    if (checkboxArr.length > 0) {
      try {
        const myObj = new FormData();
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        myObj.append("ids", checkboxArr);
        axios
          .post(process.env.REACT_APP_API_URL + "api/dropContacts", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setContacts(
                contacts.filter((contact) => !checkboxArr.includes(contact.id))
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
                checkboxArr.length > 0 ? dropContacts() : dropContact()
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
            <MdPermContactCalendar />
          </div>
          <div className="title">Contacts</div>
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
                  <th onClick={() => order("Full-Name", "full_name")}>
                    Full-Name{" "}
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
                  <th onClick={() => order("Message", "message")}>
                    Message{" "}
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
                  {/* <th className="all" >All</th> */}
                </tr>
                {(isSearching && searchContact ? searchContact : contacts).map(
                  (contact, index) => {
                    return (
                      <Contact
                        contact={contact}
                        contacts={contacts}
                        setContacts={setContacts}
                        setCheckboxArr={setCheckboxArr}
                        checkboxArr={checkboxArr}
                        index={index}
                        setShowMsgConf={setShowMsgConf}
                        setShowMsg={setShowMsg}
                        setContactId={setContactId}
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
export default Contacts;

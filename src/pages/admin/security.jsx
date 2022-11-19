import React, { useState, useEffect } from "react";
import "./profile.css";
import drop_img from "../../assets/images/undraw_throw_away_re_x60k (1).svg";
import { AiOutlineUser } from "react-icons/ai";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import axios from "axios";
import { useGlobalContext } from "../../context/context";

const Security = () => {
  const [showMsgConf, setShowMsgConf] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [isEyeOpen2, setIsEyeOpen2] = useState(false);
  const [isEyeOpen3, setIsEyeOpen3] = useState(false);
  const [currentPsw, setCurrentPsw] = useState("");
  const [newPsw, setNewPsw] = useState("");
  const [newPsw2, setNewPsw2] = useState("");
  const [pswConf, setPswConf] = useState("");
  const [showMsg, setShowMsg] = useState({ show: false, msg: "", error: true });
  const [showMsg2, setShowMsg2] = useState({ show: false, msg: "" });
  const { admin, setHaveAccess } = useGlobalContext();
  // change password function

  const handleData = (e) => {
    e.preventDefault();
    if (admin) {
      const { email, id } = admin;
      if (newPsw === newPsw2) {
        const myObj = new FormData();
        myObj.append("password", currentPsw);
        myObj.append("newPsw", newPsw);
        myObj.append("id", id);
        myObj.append("email", email);
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        try {
          axios
            .post(process.env.REACT_APP_API_URL + "api/changePassword", myObj, {
              withCredentials: true,
            })
            .then((data) => {
              if (data.data.status) {
                setShowMsg({ show: true, msg: data.data.msg, error: false });
              } else {
                setShowMsg({ show: true, msg: data.data.msg, error: true });
              }
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        setShowMsg({
          show: true,
          msg: "Confirmation password does not match.",
          error: true,
        });
      }
    }
  };

  // delete Account
  const drop = (e) => {
    e.preventDefault();
    if (admin) {
      if (pswConf) {
        const { email, id, type } = admin;
        const myObj = new FormData();
        myObj.append("password", pswConf);
        myObj.append("id", id);
        myObj.append("type", type);
        myObj.append("email", email);
        myObj.append(
          "api_password",
          "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
        );
        try {
          axios
            .post(process.env.REACT_APP_API_URL + "api/deleteAccount", myObj, {
              withCredentials: true,
            })
            .then((data) => {
              if (data.data.status) {
                setShowMsg2({ show: true, msg: data.data.msg });
                setHaveAccess(false);
                window.location.reload(false);
              } else {
                setShowMsg2({ show: true, msg: data.data.msg });
              }
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        setShowMsg2({ show: true, msg: "The password field is required." });
      }
    }
  };

  //hidden Msg
  useEffect(() => {
    const hidden = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, 5000);
    return () => clearTimeout(hidden);
  }, [showMsg]);

  //hidden Msg delete Account
  useEffect(() => {
    const hidden = setTimeout(() => {
      setShowMsg2({ ...showMsg2, show: false });
    }, 5000);
    return () => clearTimeout(hidden);
  }, [showMsg2]);

  return (
    <section className="security">
      <header>
        <div className="title">
          <div className="logo">
            <AiOutlineUser />
          </div>{" "}
          Account Settings - Security
        </div>
      </header>
      <div className="update-box">
        <div className="right">
          <div className="account-details">
            <div
              className={`error-box ${showMsg.show && "error-box-hidden"} ${
                !showMsg.error && "error-box-correct"
              }`}
            >
              {showMsg.msg}
            </div>
            <form onSubmit={handleData}>
              <div className="input-box">
                <div className="input-title">Current Password</div>
                <input
                  type={`${isEyeOpen ? "text" : "password"}`}
                  placeholder="Enter current Password"
                  name="currentPsw"
                  onChange={(e) => setCurrentPsw(e?.target?.value)}
                  value={currentPsw}
                />
                <div className="icon" onClick={() => setIsEyeOpen(!isEyeOpen)}>
                  {isEyeOpen ? <RiEyeFill /> : <RiEyeCloseFill />}
                </div>
              </div>
              <div className="input-box">
                <div className="input-title">New Password</div>
                <input
                  type={`${isEyeOpen2 ? "text" : "password"}`}
                  placeholder="Enter new Password"
                  name="newPsw"
                  onChange={(e) => setNewPsw(e?.target?.value)}
                  value={newPsw}
                />
                <div
                  className="icon"
                  onClick={() => setIsEyeOpen2(!isEyeOpen2)}
                >
                  {isEyeOpen2 ? <RiEyeFill /> : <RiEyeCloseFill />}
                </div>
              </div>
              <div className="input-box">
                <div className="input-title">Confirm Password</div>
                <input
                  type="password"
                  placeholder="Confirm new Password"
                  name="confrmNewPsw"
                  onChange={(e) => setNewPsw2(e?.target?.value)}
                  value={newPsw2}
                />
              </div>
              <button className="btn-prem">Save</button>
            </form>
          </div>
        </div>
        <div className="left">
          <div className="ft-picture">
            <div className="img">
              <img src={drop_img} alt="img" />
            </div>
            <div className="role">
              Deleting your account is a permanent action and cannot be undone.
              If you are sure you want to delete your account, select the button
              below.
            </div>
            <button className="btn-denger" onClick={() => setShowMsgConf(true)}>
              I understand, delete my account
            </button>
          </div>
        </div>
      </div>
      <div
        className={`msg-conf ${showMsgConf && "msg-conf-show"}`}
        onClick={(e) =>
          e.target.className === "msg-conf msg-conf-show" &&
          (setShowMsgConf(false), setPswConf(""))
        }
      >
        <form onSubmit={drop}>
          <div className={`error-box2 ${showMsg2.show && "error-box2-hidden"}`}>
            {showMsg2.msg}
          </div>
          <div className="input-box">
            <input
              type={`${isEyeOpen3 ? "text" : "password"}`}
              placeholder="Enter Your Password"
              name="pswConf"
              onChange={(e) => setPswConf(e?.target?.value)}
              value={pswConf}
            />
            <div className="icon" onClick={() => setIsEyeOpen3(!isEyeOpen3)}>
              {isEyeOpen3 ? <RiEyeFill /> : <RiEyeCloseFill />}
            </div>
          </div>
          <button className="btn-denger">Delete</button>
        </form>
      </div>
    </section>
  );
};

export default Security;

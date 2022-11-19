import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../../context/context";
import img from "../../assets/images/undraw_login_re_4vu2.svg";
import "./style.css";
import axios from "axios";

const Login = () => {
  const { haveAccess, setHaveAccess, setAdmin, getCookie } = useGlobalContext();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [showMsg, setShowMsg] = useState({ show: false, msg: "Error" });
  const login = (e) => {
    e.preventDefault();
    const myData = new FormData();
    myData.append("email", email);
    myData.append("password", psw);
    myData.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      if (!getCookie("haveAccess")) {
        axios
          .post(process.env.REACT_APP_API_URL + "api/adminLogin", myData, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setAdmin(data.data.admin);
              setHaveAccess(true);
            } else {
              setShowMsg({ show: true, msg: data.data.msg });
            }
          });
      } else {
        setHaveAccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // hidden Msg Error
  useEffect(() => {
    const show = setTimeout(() => {
      setShowMsg({ show: false, msg: "" });
    }, 5000);
    return () => clearTimeout(show);
  }, [showMsg]);
  return haveAccess ? (
    <Navigate to={from} state={{ from: location }} replace />
  ) : (
    <section className="login">
      <div className="content">
        <div className="left">
          <div className="img">
            <img src={img} alt="img" />
          </div>
        </div>
        <div className="right">
          <form onSubmit={login}>
            <div className="title">Sign in</div>
            {showMsg.show && <div className="error-box">{showMsg.msg}</div>}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={psw}
              onChange={(e) => setPsw(e.target.value)}
              placeholder="Password"
              onDoubleClick={(e) => (e.target.type = "text")}
            />
            <div className="foot">
              <div className="f-psw">Forget Your Password?</div>
              <div className="f-psw" id="cookies"></div>
              <button className="btn-prem">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

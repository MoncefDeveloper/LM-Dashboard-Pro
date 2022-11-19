import React, { } from "react";
import './../login-register/style.css';
import img from '../../assets/images/401 Error Unauthorized-amico.svg'
import { NavLink } from "react-router-dom";

const Unauthorized = () => {

  return (
    <section className="unauthorized">
      <div className="background">
        <div className="top-left"></div>
        <div className="top-right"></div>
        <div className="bottom-left"></div>
        <div className="bottom-right"></div>
      </div>
      <div className="below-door">
        <div className="left">
          <div className="message">Missing Permissions
          </div>
          <div className="message2">
            You tried to access a page you did not have prior authorization for,
            But do not worry, There is always a way to go back home
          </div>
          <NavLink replace to='/' className="btn-prem">Back home</NavLink>
        </div>
        <div className="container2">
          <img src={img} alt="img" />
          {/* <div className="door-frame">
            <div className="door">
              <div className="rectangle">
              </div>
              <div className="handle">
              </div>
              <div className="window">
                <div className="eye">
                </div>
                <div className="eye eye2">
                </div>
                <div className="leaf">
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default Unauthorized;

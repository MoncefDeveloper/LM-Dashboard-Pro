import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { GiResize } from "react-icons/gi";
import {
  HiOutlineDuplicate,
  HiOutlineMail,
  HiOutlineMenuAlt2,
  HiOutlineMailOpen,
} from "react-icons/hi";
import { MdOutlineDashboard, MdTableChart } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { BiError } from "react-icons/bi";
import logo from "./../../assets/images/lm-logo.png";
import { RiAdminFill } from "react-icons/ri";
import { CgCloseO } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import "./navbar.css";
import { useGlobalContext } from "../../context/context";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const {
    size,
    isMenuOpen,
    setSize,
    setIsMenuOpen,
    haveAccess,
    setHaveAccess,
    setPathname,
    admin,
  } = useGlobalContext();
  const [isListOpen, setIsListOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isTableOpen, setTableOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isUserMenu, setIsUserMenu] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const push = useNavigate();

  // logOut Function
  const logOut = () => {
    const myObj = new FormData();
    const url = process.env.REACT_APP_API_URL + "api/adminLogout";
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios.post(url, myObj, { withCredentials: true }).then((data) => {
        if (data.data.status) {
          push("/");
          setHaveAccess(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // document.querySelector('.index')?.scrollTo(0, 0);
    setPathname(pathname);
    setIsMobileMenuOpen(false);
  }, [pathname, setPathname]);

  return !haveAccess ? (
    <></>
  ) : (
    <>
      <div className={`navabar-top-side ${!haveAccess && "hide-navabar"}`}>
        <div className="right">
          <button
            className="ele show-menu"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsMobileMenuOpen(true);
            }}
          >
            <HiOutlineMenuAlt2 />
          </button>
          <NavLink to="/" className="ele">
            <AiOutlineHome />
          </NavLink>
          <button
            className="ele  user-ele"
            onFocus={() => setIsMessageOpen(true)}
            onBlur={() => setIsMessageOpen(false)}
          >
            {isMessageOpen ? <HiOutlineMailOpen /> : <HiOutlineMail />}
            <div className={`user-box ${isMessageOpen && "user-box-after"}`}>
              <div className="ele-user">Profile</div>
              <div className="ele-user">Security</div>
              <div className="ele-user">LogOut</div>
            </div>
          </button>
          <button
            className="ele user-ele"
            onFocus={() => setIsUserMenu(true)}
            onBlur={() => setIsUserMenu(false)}
          >
            {admin?.image_name !== "np_image.png" && admin ? (
              <img
                src={`${process.env.REACT_APP_API_URL}Product/admin/${admin?.image_name}`}
                alt="img"
              />
            ) : (
              <AiOutlineUser />
            )}
            <div className={`user-box ${isUserMenu && "user-box-after"}`}>
              <NavLink to="admin/profile" className="ele-user">
                Profile
              </NavLink>
              <NavLink to="admin/security" className="ele-user">
                Security
              </NavLink>
              <div
                className="ele-user"
                onClick={() => {
                  setIsUserMenu(false);
                  logOut();
                }}
              >
                LogOut
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className={`email-conf-bar ${hidden && "email-conf-bar-hidden"}`}>
        Please verify your email adress "{admin?.email}" {admin?.name}
        <div className="hide-bar" onClick={() => setHidden(true)}>
          x
        </div>
      </div>

      <div
        className={`navbar-left-side ${
          isMenuOpen && "navbar-left-side-after"
        } ${isMobileMenuOpen && "navbar-left-side-after-mobile"}`}
      >
        <div className="inside">
          <div className="intro-logo">
            <img src={logo} alt="img" />
          </div>

          <div className={`list size`}>
            <button
              className="ele-box "
              onClick={() => {
                setSize(!size);
                !size
                  ? (document.body.style.padding = "0px")
                  : (document.body.style.padding = "20px 30px");
              }}
            >
              <div className="logo-title">
                <div className="logo">
                  <GiResize />
                </div>
                <div className="title">Size</div>
              </div>
            </button>
          </div>

          <div className={`list`}>
            <NavLink to={`/`} className="ele-box">
              <div className="logo-title">
                <div className="logo">
                  <MdOutlineDashboard />
                </div>
                <div className="title">Dashboard</div>
              </div>
            </NavLink>
          </div>

          <div className={`list`}>
            <NavLink to={`/tasks`} className="ele-box">
              <div className="logo-title">
                <div className="logo">
                  <FaTasks />
                </div>
                <div className="title">Tasks</div>
              </div>
            </NavLink>
          </div>

          <div className={`list ${isAdminOpen && "list-after"} `}>
            <button
              className="ele-box"
              onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
              <div className="logo-title">
                <div className="logo">
                  <RiAdminFill />
                </div>
                <div className="title">Admin</div>
              </div>
              <div className="arrow">
                <IoIosArrowForward />
              </div>
            </button>
            <NavLink to="/admin/profile" className="ele-box">
              <div className="title">Profile</div>
            </NavLink>
            <NavLink to="/admin/security" className="ele-box">
              <div className="title">Security</div>
            </NavLink>
          </div>

          <div className={`list ${isListOpen && "list-after"} `}>
            <button
              className="ele-box"
              onClick={() => setIsListOpen(!isListOpen)}
            >
              <div className="logo-title">
                <div className="logo">
                  <HiOutlineDuplicate />
                </div>
                <div className="title">Pages</div>
              </div>
              <div className="arrow">
                <IoIosArrowForward />
              </div>
            </button>
            <a href="https://watch-lm.000webhostapp.com/" className="ele-box">
              <div className="title">Index</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/store"
              className="ele-box"
            >
              <div className="title">Store</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/cart"
              className="ele-box"
            >
              <div className="title">Cart</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/contact"
              className="ele-box"
            >
              <div className="title">Contact</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/account"
              className="ele-box"
            >
              <div className="title">Account</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/advice"
              className="ele-box"
            >
              <div className="title">Advice</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/meeting"
              className="ele-box"
            >
              <div className="title">Meeting</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/Privacy-Policy"
              className="ele-box"
            >
              <div className="title">Privacy Policy</div>
            </a>
            <a
              href="https://watch-lm.000webhostapp.com/terms"
              className="ele-box"
            >
              <div className="title">Terms</div>
            </a>
          </div>

          <div className={`list ${isErrorOpen && "list-after"} `}>
            <button
              className="ele-box"
              onClick={() => setIsErrorOpen(!isErrorOpen)}
            >
              <div className="logo-title">
                <div className="logo">
                  <BiError />
                </div>
                <div className="title">Errors</div>
              </div>
              <div className="arrow">
                <IoIosArrowForward />
              </div>
            </button>
            <NavLink to={"/Error/unauthorized"} className="ele-box">
              <div className="title">401 page</div>
            </NavLink>
            <NavLink to={"/Error/404"} className="ele-box">
              <div className="title">404 page</div>
            </NavLink>
          </div>

          <div className={`list ${isTableOpen && "list-after"} `}>
            <button
              className="ele-box"
              onClick={() => setTableOpen(!isTableOpen)}
            >
              <div className="logo-title">
                <div className="logo">
                  <MdTableChart />
                </div>
                <div className="title">Tables</div>
              </div>
              <div className="arrow">
                <IoIosArrowForward />
              </div>
            </button>
            {admin?.type === +process.env.REACT_APP_ADMIN_KEY && (
              <NavLink to="/table/admins" className="ele-box">
                <div className="title">Admins</div>
              </NavLink>
            )}
            <NavLink to="/table/users" className="ele-box">
              <div className="title">Users</div>
            </NavLink>
            <NavLink to="/table/categories" className="ele-box">
              <div className="title">Categories</div>
            </NavLink>
            <NavLink to="/table/products" className="ele-box">
              <div className="title">Watchs</div>
            </NavLink>
            <NavLink to="/table/contacts" className="ele-box">
              <div className="title">Contacts</div>
            </NavLink>
            <NavLink to="/table/meetings" className="ele-box">
              <div className="title">Meetings</div>
            </NavLink>
            <NavLink to="/table/messages" className="ele-box">
              <div className="title">Notifications</div>
            </NavLink>
          </div>
          <div className={`list close`}>
            <div
              onClick={() => {
                setIsMenuOpen(false);
                setIsMobileMenuOpen(false);
              }}
              className="ele-box"
            >
              <div className="logo-title">
                <div className="logo">
                  <CgCloseO />
                </div>
                <div className="title">Close</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

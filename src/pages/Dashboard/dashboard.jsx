import React, { useEffect, useState } from "react";
import "./dashboard.css";
import img from "./../../assets/images/Business Plan-amico.png";
import img2 from "./../../assets/images/undraw_product_photography_91i2.svg";
import { MdPermContactCalendar, MdSell } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../context/context";
const date = new Date();
console.log(date);

const Index = () => {
  const { admin } = useGlobalContext();
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState({
    products: 0,
    tasksPers: 0,
    contacts: 0,
    meetings: 0,
  });

  useEffect(() => {
    const myData = new FormData();
    myData.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/getDashboardData", myData, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            setTasks(data.data.data.tasks);
            setData({
              products: data.data.data.products,
              tasksPers: data.data.data.tasksPers,
              contacts: data.data.data.contacts,
              meetings: data.data.data.meetings,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }

    return () => setData((prev) => [...prev]);
  }, []);

  return (
    <section className="dashboard">
      <div className="title">Dashboard</div>
      <div className="date">Friday · September 20, 2022 · 12:16 PM</div>
      <div className="informations">
        <div className="intro-box">
          <div className="left">
            <div className="mini-title">
              Welcome back <span className="name">{admin?.name}</span>, Your
              dashboard is ready!
            </div>
            <div className="text">
              Great job, your affiliate dashboard is ready to go! You can view
              sales, generate links, prepare coupons, and download affiliate
              reports using this dashboard.
            </div>
            <a href="#LM" className="btn-prem">
              Get Started
            </a>
          </div>
          <div className="right">
            <img src={img} alt="img" />
          </div>
        </div>

        <div className="all-box">
          <div className="data-box data-box-1">
            <div className="symbol">
              <MdSell />
            </div>
            <div className="box-mini-title">Products</div>
            <div className="box-score">{data?.products}</div>
          </div>

          <div className="data-box data-box-2">
            <div className="symbol">
              <FaUserFriends />
            </div>
            <div className="box-mini-title">Meet Up</div>
            <div className="box-score">{data?.meetings}</div>
          </div>

          <div className="data-box data-box-3">
            <div className="symbol">
              <BiTask />
            </div>
            <div className="box-mini-title">Tasks</div>
            <div className="box-score">{data?.tasksPers}</div>
          </div>

          <div className="data-box data-box-4">
            <div className="symbol">
              <MdPermContactCalendar />
            </div>
            <div className="box-mini-title">Contact</div>
            <div className="box-score">{data?.contacts}</div>
          </div>
        </div>
      </div>

      <div className="last-box" id="LM">
        <div className="left">
          <div className="top">
            <img src={img2} alt="img" />
            <div className="title">New Product</div>
            <div className="text">
              New Product? Ready to get started? It's time to add or create new
              one,We are waiting for you!
            </div>
            <Link to={"/table/products/add"} className="btn-prem">
              Continue
            </Link>
          </div>
          <div className="bottom">
            <div className="mini-title">Budget Overview</div>
            <div className="scrore">$38k</div>
            <div className="score-barr">
              <div className="inside-score-barr"></div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="header-title">
            <div className="title">Tasks</div>
            <NavLink to={"/tasks"} className="btn-prem">
              New task
            </NavLink>
          </div>
          <div className="all-tasks">
            {tasks?.map(({ description, updated_at, admin }, key) => {
              return (
                <div key={key} className="task-box">
                  <img
                    src={
                      process.env.REACT_APP_API_URL +
                      "Product/admin/" +
                      admin.image_name
                    }
                    alt="img"
                  />
                  <div className="text">{description}</div>
                  <div className="date">{updated_at.substring(0, 10)}</div>
                </div>
              );
            })}
          </div>
          <NavLink to={"/tasks"} className="foot">
            See All tasks
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Index;

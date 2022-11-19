import React, { useState, useEffect } from "react";
import "./product.css";
import { MdImageNotSupported, MdUpdate } from "react-icons/md";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Pictures = () => {
  const [pictures, setPictures] = useState([]);
  const [view, setView] = useState(false);
  const { id } = useParams();
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });
  const replace = useNavigate();

  // check url and Paramiter
  useEffect(() => {
    const checkIfExist = () => {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", id);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/check", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setView(true);
            } else {
              setView(false);
              replace("/Error/404", replace);
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    checkIfExist();
  }, [id]);

  // get pictures
  useEffect(() => {
    const gatPictures = () => {
      const myObj = new FormData();
      myObj.append(
        "api_password",
        "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
      );
      myObj.append("id", id);
      try {
        axios
          .post(process.env.REACT_APP_API_URL + "api/getImages", myObj, {
            withCredentials: true,
          })
          .then((data) => {
            if (data.data.status) {
              setPictures(data.data.pictures);
            } else {
              setView(false);
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    gatPictures();
  }, [id]);

  // drop image function
  const drop = (imageId) => {
    const myObj = new FormData();
    myObj.append(
      "api_password",
      "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
    );
    myObj.append("id", imageId);
    try {
      axios
        .post(process.env.REACT_APP_API_URL + "api/dropPicture", myObj, {
          withCredentials: true,
        })
        .then((data) => {
          if (data.data.status) {
            const newPictures = pictures.filter(
              (picture) => picture.id !== imageId
            );
            setPictures(newPictures);
            setShowMsg({ show: true, msg: data.data.msg, error: false });
          } else {
            setShowMsg({ show: true, msg: data.data.msg, error: true });
          }
        });
    } catch (error) {
      console.log(error);
    }
    document.querySelector(".index")?.scrollTo(0, 0);
  };

  // hidden Msg
  useEffect(() => {
    const hidden = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, [5000]);
    return () => clearTimeout(hidden);
  }, [showMsg]);
  return (
    <>
      {view ? (
        <section className="pictures">
          <div className="title">Pictures</div>
          <div className="under-title">
            <div className="text">
              Manage your pictures, Update , delete , Or create new one
            </div>
            <NavLink
              to={"/table/products/addPicture/" + id}
              className="btn-prem"
            >
              Add new picture
            </NavLink>
          </div>
          <div
            className={`msg-error-box ${showMsg.show && "msg-error-box-show"}
              ${!showMsg.error && "msg-error-box-false"} `}
          >
            {showMsg.msg}
          </div>
          <div className="album">
            {pictures ? (
              pictures.map((picture, key) => {
                const { id, image_name } = picture;
                return (
                  <div key={key} className="img-box">
                    <img
                      src={`${process.env.REACT_APP_API_URL}Product/images/${image_name}`}
                      alt="img"
                    />
                    <div className="buttons">
                      <Link
                        to={`/table/products/pictures/update-picture/${id}`}
                        className="btn update"
                      >
                        <MdUpdate />
                      </Link>
                      <div onClick={() => drop(id)} className="btn delete">
                        <MdImageNotSupported />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="null">Nothing! Go back to add some pictures.</div>
            )}
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default Pictures;

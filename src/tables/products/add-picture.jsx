import React, { useState, useCallback, useEffect, useRef } from "react";
import "./product.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BiReset } from "react-icons/bi";
import { RiScissorsCutFill, RiArrowGoBackFill } from "react-icons/ri";
import img from "./../../assets/images/undraw_photos_re_pvh3.svg";

import Cropper from "react-easy-crop";
import getCroppedImg from "../../function/CropImg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddPicture = () => {
  const [newImg, setNewImg] = useState(img);
  const [prevImg, setPrevImg] = useState(img);
  const [file, setfile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [sameImg, setSameImg] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [view, setView] = useState(false);
  const [stop, setStop] = useState(false);
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    error: false,
  });
  const [dim, setDim] = useState(4 / 3);
  const [imgDim, setImgDim] = useState({ width: 0, height: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputFile = useRef(null);
  const { id } = useParams();
  const replace = useNavigate();

  const dimArr = [
    { name: "16:9", value: 16 / 10.7, width: "100%", height: "56.5" },
    { name: "9:16", value: 9 / 16, width: "35%", height: "100%" },
    { name: "4:3", value: 4 / 3, width: "100%", height: "75%" },
    { name: "3:4", value: 3 / 4, width: "45%", height: "100%" },
  ];

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

  // add image function
  const handleData = (e) => {
    e.preventDefault();
    if (!sameImg) {
      if (isCropping) {
        if (!stop) {
          if (file && newImg !== img) {
            setIsCropping(false);
            if (file?.size / (1024 * 1024) < 1.5) {
              const myObj = new FormData();
              myObj.append(
                "api_password",
                "sskPTvYSaTYacyDRwbwnWqc1KN1g7frlq03IcCvyQ58gWFUo"
              );
              myObj.append("id", id);
              myObj.append("image", file);
              try {
                axios
                  .post(process.env.REACT_APP_API_URL + "api/AddImage", myObj, {
                    withCredentials: true,
                  })
                  .then((data) => {
                    if (data.data.status) {
                      setShowMsg({
                        show: true,
                        msg: data.data.msg,
                        error: false,
                      });
                    } else {
                      setShowMsg({
                        show: true,
                        msg: data.data.msg,
                        error: true,
                      });
                    }
                  });
              } catch (error) {
                console.log(error);
              }
              setStop(true);
              setSameImg(true);
            } else {
              setShowMsg({
                show: true,
                msg: "IMAGE SHOULD BE LESS THAN 1.5 MB.",
                error: true,
              });
            }
          } else {
            setShowMsg({ show: true, msg: "Image is required.", error: true });
          }
          document.querySelector(".index")?.scrollTo(0, 0);
        }
      } else {
        onCrop();
        setIsCropping(true);
      }
    } else {
      setShowMsg({
        show: true,
        msg: "You can't upload the same image  twice.",
        error: true,
      });
    }
  };

  // crop function
  const onCrop = async () => {
    if (newImg !== img) {
      const croppedImgUrl = await getCroppedImg(newImg, croppedAreaPixels);
      (await croppedImgUrl) && setNewImg(croppedImgUrl.url);
      (await croppedImgUrl) && setfile(croppedImgUrl.file);
      (await croppedImgUrl) && setZoom(1);
      (await croppedImgUrl) && setSameImg(false);
      (await croppedImgUrl) && setIsCropping(true);
    }
  };

  // package easy-crop function
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setImgDim({
      width: croppedAreaPixels.width,
      height: croppedAreaPixels.height,
    });
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  //  showing img
  const handleImg = (e) => {
    setZoom(1);
    setSameImg(false);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewImg(reader.result);
        setPrevImg(reader.result);
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setfile(e.target.files[0]);
    } else {
      setNewImg(img);
      setPrevImg(img);
      setfile(null);
    }
  };

  // hidden Msg
  useEffect(() => {
    const hidden = setTimeout(() => {
      setShowMsg({ ...showMsg, show: false });
    }, [5000]);
    return () => clearTimeout(hidden);
  }, [showMsg]);

  // set Stop to false
  useEffect(() => {
    const stop = setTimeout(() => {
      setStop(false);
    }, [5000]);
    return () => clearTimeout(stop);
  }, [stop]);

  useEffect(() => {
    console.log();
  }, [file]);

  return (
    <>
      {view ? (
        <section className="add-picture">
          <header>Add Picture</header>
          <div className="text">
            Image settings, you can update dimentions
            <br />
            All picture upload with webp form at the end
          </div>
          <div className="content">
            <form className="left-side" onSubmit={handleData}>
              <div className="controllers">
                <button
                  className={`label-2 
                    ${
                      (!file ||
                        (file &&
                          (Math.floor(crop.x) !== 0 ||
                            Math.floor(crop.y) !== 0))) &&
                      "acitve"
                    }`}
                >
                  <MdOutlineDownloadDone className="sym" />
                </button>
                <label
                  className={`label-2 ${!file && "acitve"}`}
                  onClick={() => {
                    setNewImg(prevImg) || setZoom(1);
                    setfile(null);
                  }}
                >
                  <BiReset className="sym" />
                </label>
                <label className="label-2" onClick={onCrop}>
                  <RiScissorsCutFill className="sym" />
                </label>
                <label htmlFor="img" className="label-2">
                  <AiOutlineCloudUpload className="sym" />
                </label>
                <Link to={`/table/products`} className="label-2">
                  <RiArrowGoBackFill className="sym" />
                </Link>
              </div>
              <div
                className={`msg-error-box ${
                  showMsg.show && "msg-error-box-show"
                }
              ${!showMsg.error && "msg-error-box-false"} `}
              >
                {showMsg.msg}
              </div>
              <div className="box">
                {/* <img src={newImg} /> */}
                <Cropper
                  image={newImg}
                  crop={crop}
                  zoom={zoom}
                  aspect={dim}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <input
                type="file"
                id="img"
                onChange={handleImg}
                ref={inputFile}
              />
            </form>
            <div className="right-side">
              <div className="boxes">
                {dimArr.map((dimn, key) => {
                  const { name, value, width, height } = dimn;
                  return (
                    <div
                      key={key}
                      className="dim-box"
                      onClick={() => setDim(value)}
                    >
                      <div
                        className={`design ${
                          dim === value && "dim-box-checked"
                        }`}
                        style={{ width: width, height: height }}
                      ></div>
                      <div>{name}</div>
                    </div>
                  );
                })}
              </div>
              <div className="dimension">
                <div className="wi">{imgDim.width} PX</div>
                <div className="wi">{imgDim.height} PX</div>
              </div>
              <div className="controls">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(e.target.value);
                  }}
                  className="zoom-range"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddPicture;

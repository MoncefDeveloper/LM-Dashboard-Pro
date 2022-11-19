import React, { useState, useEffect } from "react";
import img from "./../../assets/images/undraw_photos_re_pvh3.svg";
import backImg from "./../../assets/images/undraw_photos_re_pvh3.svg";
import { BiError } from "react-icons/bi";
import { useForm } from "react-hook-form";
import Loader from "../loader/loader";

const UpdateProductForm = ({ handleData, categories, product }) => {
  const [isReset, setIsReset] = useState(false);
  const [newImg, setNewImg] = useState(img);
  const [newBackImg, setNewBackImg] = useState(backImg);
  const roles = ["Simple", "Menu", "First_page", "More"];
  // useForm for react-hook-form
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  });

  // set old data
  useEffect(() => {
    if (product) {
      const {
        name,
        price,
        role,
        description,
        details,
        category,
        active,
        image_name,
        back_image_name,
        trend,
      } = product;
      image_name &&
        setNewImg(
          `${process.env.REACT_APP_API_URL}Product/watchs/${image_name}`
        );
      back_image_name &&
        setNewBackImg(
          `${process.env.REACT_APP_API_URL}Product/watchs/${back_image_name}`
        );
      reset({
        name: name,
        price: price,
        description: description,
        details: details,
        role: role,
        category: category?.id,
        active: active?.toString(),
        trend: trend?.toString(),
        product_img: "",
        product_img_back: "",
      });
    }
  }, [product, isReset, reset]);
  // showing img
  const handleImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewImg(reader.result);
      }
    };
    e.target.files[0]
      ? reader.readAsDataURL(e.target.files[0])
      : setNewImg(img);
  };

  // showing back img
  const handleBackImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewBackImg(reader.result);
      }
    };
    e.target.files[0]
      ? reader.readAsDataURL(e.target.files[0])
      : setNewBackImg(backImg);
  };

  return (
    <>
      {product ? (
        <form onSubmit={handleSubmit(handleData)}>
          <div className="left">
            {/* Front-Img */}
            <div className="img-box">
              <label htmlFor="product_img">
                <div className="img">
                  <img src={newImg} alt="img" />
                </div>
              </label>
              <input
                type="file"
                id="product_img"
                onChange={(e) => {
                  setValue("product_img", e.target.value.files);
                }}
                {...register("product_img", {
                  onChange: handleImg,
                })}
              />
              <div className="role">JPG or PNG no larger than 1 MB</div>
            </div>

            {/* Back-Img */}
            <div className="img-box">
              <label htmlFor="product_img_back">
                <div className="img">
                  <img src={newBackImg} alt="img" />
                </div>
              </label>
              <input
                type="file"
                id="product_img_back"
                onChange={(e) => {
                  setValue("product_img_back", e.target.value.files);
                }}
                {...register("product_img_back", {
                  onChange: handleBackImg,
                })}
              />
              <div className="role">JPG or PNG no larger than 1 MB</div>
            </div>
          </div>

          <div className="right">
            <div onClick={() => setIsReset(!isReset)} className="btn-prem">
              Reset
            </div>

            {/* name */}
            <div className="input-box">
              <div className="input-title">Product name:</div>
              <input
                type="text"
                placeholder="Exemple"
                {...register("name", { required: true, minLength: 3 })}
              />
              {errors.name && errors.name.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
              {errors.name && errors.name.type === "minLength" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>
                  Min Length Should Be 3
                </div>
              )}
            </div>

            {/* price */}
            <div className="input-box">
              <div className="input-title">Price:</div>
              <input
                type="number"
                placeholder="2200"
                {...register("price", { required: true })}
              />
              {errors.price && errors.price.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}

              {/*  Description  */}
            </div>
            <div className="input-box">
              <div className="input-title">Description:</div>
              <textarea
                placeholder="Exemple is exemple"
                rows="10"
                {...register("description", { required: true, minLength: 10 })}
              />
              {errors.description && errors.description.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
              {errors.description && errors.description.type === "minLength" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>
                  Min Length Should Be 10
                </div>
              )}
            </div>

            {/* Details */}
            <div className="input-box">
              <div className="input-title">Details:</div>
              <textarea
                placeholder="Exemple is exemple"
                rows={10}
                {...register("details", { required: true, minLength: 10 })}
              />
              {errors.details && errors.details.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
              {errors.details && errors.details.type === "minLength" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>
                  Min Length Should Be 10
                </div>
              )}
            </div>

            {/* Category */}
            <div className="input-box">
              <div className="input-title">Category name:</div>
              <select {...register("category", { required: true })}>
                {categories?.map((Mycategory, key) => {
                  return (
                    <option key={key} value={Mycategory.id}>
                      {Mycategory.name}
                    </option>
                  );
                })}
              </select>
              {errors.category && errors.category.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
            </div>

            {/* Role */}
            <div className="input-box">
              <div className="input-title">Role:</div>
              <select {...register("role", { required: true })}>
                {roles?.map((role, key) => {
                  return (
                    <option key={key} value={role}>
                      {role}
                    </option>
                  );
                })}
              </select>
              {errors.role && errors.role.type === "required" && (
                <div className="validate">
                  <div className="sym">
                    <BiError />
                  </div>{" "}
                  This is Required
                </div>
              )}
            </div>

            {/* Trend */}
            <div className="input-box">
              <div className="input-radio">
                <div className="input-title">Trend:</div>
                <input
                  type="radio"
                  value="0"
                  {...register("trend", { required: true })}
                />{" "}
                No
                <input
                  type="radio"
                  value="1"
                  {...register("trend", { required: true })}
                />{" "}
                Yes
              </div>
            </div>

            {/* Active */}
            <div className="input-box">
              <div className="input-radio">
                <div className="input-title">Active:</div>
                <input
                  type="radio"
                  value="0"
                  {...register("active", { required: true })}
                />{" "}
                No
                <input
                  type="radio"
                  value="1"
                  {...register("active", { required: true })}
                />{" "}
                Yes
              </div>
            </div>
            <button className="btn-prem">Update Product</button>
          </div>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default UpdateProductForm;

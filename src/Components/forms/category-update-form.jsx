import React, { useState, useEffect } from "react";
import img from "./../../assets/images/undraw_photos_re_pvh3.svg";
import { BiError } from "react-icons/bi";
import { useForm } from "react-hook-form";
import Loader from "../loader/loader";

const UpdateCategoryForm = ({ handleData, category }) => {
  const [isReset, setIsReset] = useState(false);
  const [newImg, setNewImg] = useState(img);

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

  // Reset Data
  useEffect(() => {
    if (category) {
      const { name, description, active, image_name } = category;
      image_name &&
        setNewImg(
          `${process.env.REACT_APP_API_URL}Product/collection/${image_name}`
        );
      reset({
        name: name,
        description: description,
        active: active?.toString(),
        category_img: "",
      });
    }
  }, [category, isReset, reset]);

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

  return (
    <>
      {category ? (
        <form onSubmit={handleSubmit(handleData)}>
          <div className="left">
            {/* Front-Img */}
            <div className="img-box">
              <label htmlFor="category_img">
                <div className="img">
                  <img src={newImg} alt="img" />
                </div>
              </label>
              <input
                type="file"
                id="category_img"
                onChange={(e) => {
                  setValue("category_img", e.target.value.files);
                }}
                {...register("category_img", {
                  onChange: handleImg,
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
              <div className="input-title">Category name:</div>
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

            {/* description */}
            <div className="input-box">
              <div className="input-title">description:</div>
              <textarea
                rows={7}
                type="text"
                placeholder="Exemple"
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
            <button className="btn-prem">Update Category</button>
          </div>
        </form>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default UpdateCategoryForm;

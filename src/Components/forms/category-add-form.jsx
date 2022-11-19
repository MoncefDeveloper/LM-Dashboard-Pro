import React, { useState } from "react";
import img from './../../assets/images/undraw_photos_re_pvh3.svg';
import { BiError } from 'react-icons/bi'
import { useForm } from "react-hook-form";


const AddCategoryForm = ({ handleData }) => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm({
    shouldFocusError: true,
  });
  const [newImg, setNewImg] = useState(img);

  // showing img 
  const handleImg = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setNewImg(reader.result);
      }
    }
    e.target.files[0] ? reader.readAsDataURL(e.target.files[0]) : setNewImg(img);
  }

  
  return (
    <form onSubmit={handleSubmit(handleData)}>
      <div className="left">

        {/* Front-Img */}
        <div className="img-box">
          <label htmlFor="category_img">
            <div className="img"><img src={newImg} alt="img" /></div>
          </label>
          <input
            type='file'
            id="category_img"
            onChange={(e) => { setValue('category_img', e.target.value.files) }}
            {...register('category_img', {
              onChange: handleImg,
              required: true,
              validate: value =>
                value[0].size / 1024 < 1000 || "Size must Be at the most 1 Mo"
            })}
          />
          <div className="role">JPG or PNG no larger than 1 MB</div>
          {(errors.category_img && errors.category_img.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {errors.category_img && errors.category_img.type === 'validate' && (
            <div className="validate"><div className="sym"><BiError /></div> Size must Be at the most 1 Mo</div>
          )}
        </div>
      </div>
      <div className="right">

        {/* name */}
        <div className="input-box">
          <div className="input-title">Category name:</div>
          <input type="text" placeholder="Exemple" {...register('name', { required: true, minLength: 3 })} />
          {(errors.name && errors.name.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors.name && errors.name.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 3</div>
          )}
        </div>
        
        {/* description */}
        <div className="input-box">
          <div className="input-title">description:</div>
          <textarea rows={7} type="text" placeholder="Description and Exemple" {...register('description', { required: true, minLength: 10 })} />
          {(errors.description && errors.description.type === 'required') && (
            <div className="validate"><div className="sym"><BiError /></div> This is Required</div>
          )}
          {(errors.description && errors.description.type === 'minLength') && (
            <div className="validate"><div className="sym"><BiError /></div>Min Length Should Be 10</div>
          )}
        </div>

        {/* Active */}
        <div className="input-box">
          <div className="input-radio">
            <div className="input-title">Active:</div>
            <input type='radio' defaultChecked value='0' {...register('active', { required: true })} /> No
            <input type='radio' value='1' {...register('active', { required: true })} /> Yes
          </div>
        </div>
        <button className="btn-prem">Add Category</button>
      </div>
    </form>
  );
}

export default AddCategoryForm;
